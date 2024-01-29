require 'sinatra'
require 'sinatra/reloader' if development?

get '/' do
  erb :index
end

get '/endpoint' do
  'We are so back!'
end