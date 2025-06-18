!macro NSIS_HOOK_POSTINSTALL
    WriteRegStr HKCU "Software\\TrViewer" "InstallPath" "$INSTDIR"

    WriteRegStr HKCR "Directory\\shell\\OpenTrViewer" "" "TrViewer"
    WriteRegStr HKCR "Directory\\shell\\OpenTrViewer" "Icon" '"$INSTDIR\\tr-viewer.exe"'
    WriteRegStr HKCR "Directory\\shell\\OpenTrViewer\\command" "" '"$INSTDIR\\tr-viewer.exe" "%V"'

    WriteRegStr HKCR "Directory\\Background\\shell\\OpenTrViewer" "" "TrViewer"
    WriteRegStr HKCR "Directory\\Background\\shell\\OpenTrViewer" "Icon" '"$INSTDIR\\tr-viewer.exe"'
    WriteRegStr HKCR "Directory\\Background\\shell\\OpenTrViewer\\command" "" '"$INSTDIR\\tr-viewer.exe" "%V"'
!macroend

!macro NSIS_HOOK_PREUNINSTALL
    DeleteRegKey HKCR "Directory\\shell\\OpenTrViewer"
    DeleteRegKey HKCR "Directory\\Background\\shell\\OpenTrViewer"
    DeleteRegKey HKCU "Software\\TrViewer"
!macroend