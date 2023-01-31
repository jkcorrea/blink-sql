use std::sync::Arc;

use rspc::{Config, Router};

pub(crate) fn mount() -> Arc<Router> {
    let config = Config::new().set_ts_bindings_header("/* eslint-disable */");

    #[cfg(all(debug_assertions, not(feature = "mobile")))]
    let config = config.export_ts_bindings(
        std::path::PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("../src/lib/rspc.d.ts"),
    );

    let r = <Router>::new()
        .config(config)
        .query("version", |t| {
            t(|_ctx, _input: ()| env!("CARGO_PKG_VERSION"))
        })
        .build()
        .arced();
    // InvalidRequests::validate(r.clone()); // This validates all invalidation calls.

    r
}

#[cfg(test)]
mod tests {
    /// This test will ensure the rspc router and all calls to `invalidate_query` are valid and also export an updated version of the Typescript bindings.
    #[test]
    fn test_and_export_rspc_bindings() {
        super::mount();
    }
}
