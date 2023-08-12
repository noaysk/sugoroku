<template>
  <head>
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <div class="result">
      <h1>結果</h1>
      <ul>
        <li v-for="(alignedData) in alignedDataArray">
          <div style="display:flex; justify-content: center; align-items: center;"><div :class="alignedData.icon"></div><p>{{alignedData.rank}}位 :  {{alignedData.name}}</p></div> 
          <div v-if="alignedData.distance != 0">ゴールまであと {{ alignedData.distance }} マス</div>
        </li>
      </ul>
      <button @click="onClickTitleButton()">タイトルへ</button>
    </div>
  </body>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { emptyPlayerObj } from '../objects/player';
import { judgeTheRanking }from '../objects/sugoroku'

//順位順に並び替えられたプレイヤーの名前とアイコンのパスを持つ配列を取得
const alignedDataArray = ref(judgeTheRanking())
console.log(alignedDataArray.value[0].icon)
console.log(alignedDataArray.value[1].icon)
console.log(alignedDataArray.value[2].icon)


const router = useRouter()
//タイトルボタン押下処理
const onClickTitleButton=()=>{
  //プレイヤーオブジェクトを空にする
  emptyPlayerObj()
  //タイトル画面に遷移
  router.push("/")
}
</script>

<style scoped>
.player1 {
        background-image: url("../../images/playerImages/bird_red.png");
        height: 50px;
        width: 50px;
        background-size: contain;
        background-repeat: no-repeat;
}
.player2 {
    background-image: url("../../images/playerImages/bird_blue.png");
    height: 50px;
    width: 50px;
    background-size: contain;
    background-repeat: no-repeat;
}
.player3 {
    background-image: url("../../images/playerImages/bird_yellow.png");
    height: 50px;
    width: 50px;
    background-size: contain;
    background-repeat: no-repeat;
}
.player4 {
    background-image: url("../../images/playerImages/bird_green.png");
    height: 50px;
    width: 50px;
    background-size: contain;
    background-repeat: no-repeat;
}
.result {
  text-align: center;
}
h1 {
  font-size: 60px;
  font-weight: 700;
  margin: 5% 0 1% 0;
}
.result ul {
  padding-left: 0;
  list-style: none;
  font-size: 45px;
  font-weight: 700;
  line-height: 2;
}
/* .result ul li {
  text-align: left;
} */
span {
  font-size: 35px;
  font-weight: 600;
}
button {
  margin-top: 5%;
  background: #40ff75;
  border: 2px solid transparent;
  padding: 5px 50px;
  border-radius: 10px;
  font-size: 40px;
  font-weight: 700;
  color: #fff;
}
button:hover {
  font-size: 45px;
  cursor: pointer;
}
</style>