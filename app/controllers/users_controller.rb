class UsersController < ApplicationController
  before_action :authenticate_user!
  # GET /users/:id
  def show
    @user = User.find( params[:id] )
  end
  
  # GET /users
  def index
    results_per_page = 2
    page = Float(params[:page])
    
    @users = User.find(page * results_per_page + 1, page * results_per_page + 2)
  end
  
  
end