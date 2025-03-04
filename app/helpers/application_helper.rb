module ApplicationHelper
  def safe_blob_url(blob)
    rails_blob_url(blob, only_path: true)
  end

  def safe_representation_url(variant)
    rails_representation_url(variant, only_path: true)
  end
end
