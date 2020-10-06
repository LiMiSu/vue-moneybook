let go: number = parseInt(window.localStorage.getItem('go') || '0') || 0;

function goControl() {
  go++;
  window.localStorage.setItem('go', go.toString());
  return go;
}

export default goControl;