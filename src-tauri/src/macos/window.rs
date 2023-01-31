use super::native::NSObject;
#[allow(unused)]
use swift_rs::*;

#[allow(unused)]
extern "C" {
    pub fn lock_app_theme(theme_type: i32);
    pub fn blur_window_background(window: &NSObject);
    pub fn set_titlebar_style(window: &NSObject, transparent: bool, large: bool);
}

#[allow(dead_code)]
pub enum AppThemeType {
    Light = 0 as isize,
    Dark = 1 as isize,
}
