import { invoke } from "@tauri-apps/api/core";
import { revealItemInDir, openPath, openUrl } from '@tauri-apps/plugin-opener';
import {DiskInfo, Folder, OptParams, TextContent, HomeType} from "./bindings.ts";

export const readText = async (pathStr: string): Promise<TextContent> => {
    return await invoke("read_text", {pathStr})
}

export const readFolder = async (params: OptParams): Promise<Folder> => {
    return await invoke("read_folder", {params})
}

export const setState = async (key: string, val?: string): Promise<string | undefined> => {
    return await invoke("set_state", {key, val})
}

export const getState = async (key: string, default_val?: string): Promise<string | undefined> => {
    return await invoke("get_state", {key, default_val})
}

export const getHomeDir = async (): Promise<{[key in HomeType]: string}> => {
    return await invoke("get_home_dir")
}

export const getDisks = async (): Promise<DiskInfo[]> => {
    return await invoke("get_disks")
}

export const getArgPath = async (): Promise<string | undefined> => {
    return await invoke("get_arg_path")
}

export const shellOpenPath = async (path?: string): Promise<void> => {
    if (!path) return
    return await openPath(path)
}

export const shellOpenUrl = async (path?: string): Promise<void> => {
    if (!path) return
    return await openUrl(path)
}

export const shellShowItemInFolder = async (path?: string) => {
    if (!path) return
    return await revealItemInDir(path)
}
