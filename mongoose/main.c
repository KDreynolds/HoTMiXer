#include "mongoose.h"

static const char *s_web_root = "./web_root";

// Adjust the function signature to match what Mongoose expects
static void fn(struct mg_connection *c, int ev, void *ev_data) {
  if (ev == MG_EV_HTTP_MSG) {
    struct mg_http_message *hm = (struct mg_http_message *) ev_data;

    // Check if the request is for the "/endpoint" URL
    if (mg_http_match_uri(hm, "/endpoint")) {
      // Send a simple response for the "/endpoint" route
      mg_http_reply(c, 200, "Content-Type: text/plain\r\n", "We are so back!");
    } else {
      // For all other requests, serve files from the web_root directory
      struct mg_http_serve_opts opts = {.root_dir = s_web_root};
      mg_http_serve_dir(c, ev_data, &opts);
    }
  }
}

int main(void) {
  struct mg_mgr mgr;
  mg_mgr_init(&mgr);
  // Note the removal of the last argument, 'fn_data', when setting up the listener
  mg_http_listen(&mgr, "http://localhost:8000", fn, NULL);  // Start HTTP server

  printf("Starting web server on port 8000\n");
  for (;;) mg_mgr_poll(&mgr, 1000);  // Infinite event loop
  mg_mgr_free(&mgr);

  return 0;
}