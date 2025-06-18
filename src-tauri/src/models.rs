use std::collections::BTreeSet;
use std::time::SystemTime;
use serde::{Serialize, Deserialize};
use serde_with::{serde_as, skip_serializing_none};
use thiserror::Error;
use std::io;
use serde_json;
use specta::Type;

#[derive(Type, Serialize, Deserialize, Clone, Eq, PartialEq, Hash, PartialOrd, Ord, Debug)]
pub enum MetaType {
    Sz,
    Tm,
    Mt,
    Ext,
}

#[allow(dead_code)]
#[derive(Type, Serialize, Deserialize, Clone, Eq, PartialEq, Hash, Debug)]
pub enum OrderBy {
    Dir,
    Nm,
    Sz,
    Tm,
    Mt,
    Ext,
}

#[allow(dead_code)]
#[derive(Type, Serialize, Deserialize, Eq, Clone, PartialEq, Hash, Debug)]
pub enum OrderAsc {
    Asc,
    Desc,
}

#[allow(dead_code)]
#[derive(Type, Serialize, Deserialize, Eq, Clone, PartialEq, Hash, Debug)]
pub enum HomeType {
    RootDir,
    HomeDir,
    DownloadDir,
    VideoDir,
    DocumentDir,
    DesktopDir,
    PictureDir,
    AudioDir,
    ConfigDir,
    DataDir,
    DataLocalDir,
    CacheDir,
    FontDir,
    PublicDir,
    ExecutableDir,
    RuntimeDir,
    TemplateDir,
}


#[derive(Type, Serialize, Deserialize, Clone, Eq, PartialEq, Hash, Debug)]
pub struct OrdItem {
    pub nm: OrderBy,
    pub asc: OrderAsc,
}

#[derive(Type, Serialize, Deserialize, Clone, Eq, PartialEq, Hash, Debug)]
pub struct DiskInfo {
    pub path: String,
}



#[derive(Clone, Eq, PartialEq, Hash)]
pub struct CacheKey {
    pub nm: String,
    pub path: String,
    pub tm: SystemTime,
    pub meta_types: BTreeSet<MetaType>,
}


#[derive(Clone, Eq, PartialEq, Hash)]
pub struct CachePathsKey {
    pub nm: String,
    pub path: String,
    pub tm: SystemTime,
}


#[derive(Clone, Eq, PartialEq, Hash)]
pub struct CacheFileKey {
    pub nm: String,
    pub path: String,
    pub tm: SystemTime,
}

#[derive(Clone)]
pub struct CacheVal {
    pub items: Vec<Item>,
    pub ordering: Vec<OrdItem>,
}

#[allow(dead_code)]
#[skip_serializing_none]
#[derive(Type, Serialize, Deserialize, Debug, Default)]
pub struct Folder {
    pub item: Item,
    pub path_param: String,
    pub base_nm: String,
    pub tot: Option<usize>,
    pub cnt: Option<usize>,
    pub skip_n: Option<usize>,
    pub take_n: Option<usize>,
    pub ordering: Option<Vec<OrdItem>>,
}


#[allow(dead_code)]
#[skip_serializing_none]
#[serde_as]
#[derive(Type, Serialize, Deserialize, Clone, Debug, Default)]
pub struct Item {
    pub nm: String,
    pub dir: bool,
    pub ext: Option<String>,
    pub mt: Option<String>,
    pub sz: Option<u64>,  // u64
    pub tm: Option<u64>,  // u64
    pub items: Option<Vec<Item>>
}

#[allow(dead_code)]
#[skip_serializing_none]
#[serde_as]
#[derive(Type, Serialize, Deserialize, Clone, Debug, Default)]
pub struct TextContent {
    pub path: String,
    pub mimetype: String,
    pub enc: Option<String>,
    pub text: Option<String>,
}


#[allow(dead_code)]
#[skip_serializing_none]
#[serde_as]
#[derive(Type, Serialize, Deserialize, Clone, Debug, Default)]
pub struct OptParams {
    pub path_str: Option<String>,
    pub meta_types: Option<Vec<MetaType>>,
    pub ordering: Option<Vec<OrdItem>>,
    pub skip_n: Option<usize>,
    pub take_n: Option<usize>,
    pub is_pretty: Option<bool>,
    pub cache_nm: Option<String>,
}


#[allow(dead_code)]
#[derive(Type, Serialize, Deserialize, Clone, Debug)]
pub struct Params {
    pub path_str: String,
    pub meta_types: Vec<MetaType>,
    pub ordering: Vec<OrdItem>,
    pub skip_n: Option<usize>,
    pub take_n: Option<usize>,
    pub is_pretty: bool,
    pub cache_nm: Option<String>,
}

impl Default for Params {
    fn default() -> Self {
        Params {
            path_str: String::from("."),
            meta_types: vec![MetaType::Sz, MetaType::Tm],
            ordering: vec![OrdItem{nm: OrderBy::Dir, asc: OrderAsc::Asc}, OrdItem{nm: OrderBy::Nm, asc: OrderAsc::Asc}],
            skip_n: None,
            take_n: Some(5),
            is_pretty: true,
            cache_nm: None,
        }
    }
}


// use windows::core::Error as WinError;

#[derive(Type, Serialize, Deserialize, Error, Debug)]
pub enum ApiError {

    #[error("IO error: {0}")]
    Io(String),

    #[error("JSON error: {0}")]
    Json(String),

    #[error("Folder error: {0}")]
    Folder(String),

    #[error("windows::core::Error: {0}")]
    DirApi(String),


}

impl From<io::Error> for ApiError {
    fn from(e: io::Error) -> Self {
        ApiError::Io(e.to_string())
    }
}

impl From<serde_json::Error> for ApiError {
    fn from(e: serde_json::Error) -> Self {
        ApiError::Json(e.to_string())
    }
}

impl From<windows::core::Error> for ApiError {
    fn from(e: windows::core::Error) -> Self {
        ApiError::DirApi(e.to_string())
    }
}

