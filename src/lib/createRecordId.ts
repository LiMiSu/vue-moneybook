let dateilid: number = parseInt(window.localStorage.getItem('_dateilidMax') || '0') || 0;

function createRecordId() {
  dateilid++;
  window.localStorage.setItem('_dateilidMax', dateilid.toString());
  return dateilid;
}

export default createRecordId;