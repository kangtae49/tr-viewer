import MainPane from "@components/MainPane"
// import { Window } from '@tauri-apps/api/window'
//
// window.open = (url?: string, target?: string) => {
//   if (url && url.startsWith('http')) {
//     const label = `popup-${Date.now()}`;
//     new Window(label, {
//       url,
//       width: 800,
//       height: 600,
//     });
//   } else {
//     console.warn('Blocked window.open for', url)
//   }
//   return null
// }

function App() {
  return (
    <MainPane />
  )
}

export default App;
