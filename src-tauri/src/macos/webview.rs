use super::native::NSObject;

#[allow(unused)]
extern "C" {
    pub fn reload_webview(webview: &NSObject);
}
