class Api::V1::PaymentsController < Api::V1::BaseController
    private

    def payment_params
        params.expect(:phone_number, :card_code)
    end
end

