import MainPane from "@components/MainPane"

window.addEventListener("beforeunload", (e) => {
    e.preventDefault();
    e.stopPropagation();
    // e.returnValue = "";
});

function App() {
  return (
    <MainPane />
  )
}

export default App;
