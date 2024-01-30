require 'sinatra'
require 'sinatra/markaby'
require 'sinatra/reloader' if development?

get '/' do
  markaby :template
end

get '/endpoint' do
  'We are so back!'
end