# app/controllers/comments_controller.rb
class CommentsController < ApplicationController
  before_action :set_hotel
  before_action :set_comment, only: [:update, :destroy, :edit, :like, :dislike]
  allow_unauthenticated_access only: [ :index ]
  # GET /hotels/:hotel_id/comments
  def index
    filter = params[:filter]
    if filter == 'reviews'
      @comments = @hotel.comments.where(is_review: true, parent_id: nil).includes(:user, :replies)
    else
      # Load casual comments (isReview false or nil)
      @comments = @hotel.comments.where("(is_review IS NULL OR is_review = ?) AND parent_id IS NULL", false).includes(:user, :replies)
    end

    # Also pass along the current filter to the view.
    @active_filter = filter || 'comments'
  end

  def new
    @comment = Comment.new
    @hotel = Hotel.find(params[:hotel_id])
    @is_review = params[:is_review] == "true"
  end



  # app/controllers/comments_controller.rb
  def create
    @hotel = Hotel.find(params[:hotel_id])
    @comment = @hotel.comments.new(comment_params)
    @comment.user = current_user
    @is_review = params[:comment][:is_review] == "true"

    if @comment.save
      respond_to do |format|
        format.html { redirect_to hotel_comments_path(@hotel), notice: I18n.t("flash.comment_created") }
        format.turbo_stream do
          if @comment.parent_id.present?
            render turbo_stream: turbo_stream.append("comment-#{@comment.parent_id}-replies", partial: "comments/comment", locals: { comment: @comment })
          else
            render turbo_stream: turbo_stream.replace("comments-container", partial: "comments/comment", locals: { comment: @comment })
          end
        end
      end
    else
      Rails.logger.error "Comment creation failed: #{@comment.errors.full_messages.join(", ")}"
      @active_filter = params[:filter] || 'comments'
      @comments = @hotel.comments.includes(:user).order(created_at: :desc)

      respond_to do |format|
        format.html { render :index, status: :unprocessable_entity }
        format.turbo_stream
      end
    end
  end

  def edit

  end
  # PATCH/PUT /hotels/:hotel_id/comments/:id
  def update
    if @comment.update(comment_params)
      respond_to do |format|
        format.html { redirect_to hotel_comments_path(@hotel), notice: I18n.t("flash.comment_updated") }
        format.turbo_stream do
          # Render a Turbo Stream to replace the updated comment
          render turbo_stream: turbo_stream.replace(@comment, partial: "comments/comment", locals: { comment: @comment })
        end
      end
    else
      render :edit, status: :unprocessable_entity
    end
  end

  # DELETE /hotels/:hotel_id/comments/:id
  def destroy
    @comment.soft_delete
    respond_to do |format|
      format.html { redirect_to hotel_comments_path(@hotel), notice: I18n.t("flash.comment_deleted") }
      format.turbo_stream do
        # Render a Turbo Stream to remove the deleted comment
        render turbo_stream: turbo_stream.remove(@comment)
      end
    end
  end

  def like
    if @comment.liked_by?(current_user)
      @comment.unlike!(current_user)
    else
      @comment.like!(current_user)
    end
    respond_to do |format|
      format.html { redirect_back(fallback_location: hotel_comments_path(@hotel)) }
      format.turbo_stream do
        render turbo_stream: turbo_stream.replace(@comment, partial: "comments/comment", locals: { comment: @comment })
      end
    end
  end

  # POST /hotels/:hotel_id/comments/:id/dislike
  def dislike
    if @comment.disliked_by?(current_user)
      @comment.undislike!(current_user)
    else
      @comment.dislike!(current_user)
    end
    respond_to do |format|
      format.html { redirect_back(fallback_location: hotel_comments_path(@hotel)) }
      format.turbo_stream do
        render turbo_stream: turbo_stream.replace(@comment, partial: "comments/comment", locals: { comment: @comment })
      end
    end
  end

  private

  def set_hotel
    @hotel = Hotel.find(params[:hotel_id])
  end

  def set_comment
    @comment = @hotel.comments.find(params[:id])
  end

  def comment_params
    params.require(:comment).permit(:content, :parent_id, :is_review, :food_rating, :room_rating, :service_rating, :entertainment_rating)
  end


  def calculate_total_rating
    ratings = [self.food_rating, self.room_rating, self.service_rating, self.entertainment_rating].compact
    self.total_rating = ratings.sum / ratings.size if ratings.any?
  end
end
