declare module '*.vue' {
  import Vue from 'vue';
  export default Vue;
}
declare module '*.svg' {
  const content: any;
  export default content;
}


interface Vue {
  $store2: any;
  //或者
  // $store2: {
  //   罗列出store的所有API
  // };
}