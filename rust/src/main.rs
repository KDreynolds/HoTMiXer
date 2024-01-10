use actix_files as fs;
use actix_web::{web, App, HttpResponse, HttpServer, Responder};
use handlebars::Handlebars;
use serde_json::json;

async fn index(hb: web::Data<Handlebars<'_>>) -> impl Responder {
    let data = json!({});
    let body = hb.render("index", &data).unwrap();
    HttpResponse::Ok().content_type("text/html").body(body)
}

async fn endpoint() -> impl Responder {
    HttpResponse::Ok().body("We are so back!")
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let mut handlebars = Handlebars::new();
    match handlebars.register_template_file("index", "./templates/index.html") {
        Ok(_) => (),
        Err(e) => return Err(std::io::Error::new(std::io::ErrorKind::Other, e)),
    }

    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(handlebars.clone()))
            .service(web::resource("/").route(web::get().to(index)))
            .service(web::resource("/endpoint").route(web::get().to(endpoint)))
            .service(fs::Files::new("/static", "static"))
    })
    .bind("127.0.0.1:8080")?
    .run()
    .await
}
