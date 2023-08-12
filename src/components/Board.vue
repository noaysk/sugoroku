<template>
  <head>
      <title>Hello, world!</title>
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <meta name="description" content="" />
  </head>

  <body>
      <!-- マス部分 -->
      <div class="board">
          <Cell v-for="(cell, index) in cell_ts.cell" :key="index" :cellID="Number(index)" :cellText="cell.cellText" :locationIDArray="locationIDArray"></Cell>
      </div>

      <!-- 全プレイヤー名と残りターン数の表示 -->
      <div class="flex">
          <div class="score">
              <ul>
                  <li class="active" v-for="playerDisplayData of playerDisplayDatas" :key="playerDisplayData.name">
                      <div :class="playerDisplayData.icon"><span v-if="playerDisplayData.condition.restTurnCount !== 0" class="sleep"></span></div>
                      <span class="name">{{ playerDisplayData.name }}</span>
                      <div class="left">
                          <span class="ato">あと</span><span class="number">{{ playerDisplayData.distanceToGoal }}</span>
                      </div>
                  </li>
              </ul>
          </div>

          <!-- ターンプレイヤーの表示 -->
          <p class="turn"><span>{{ turnPlayerName }}</span> のターン</p>

          <div class="buttons">
              <!-- アイテムボタン -->
              <div class="btn-container" v-bind:style="borderColor">
                  <button class="item" @click="onClickItemButton()">
                      アイテム
                  </button>
              </div>
              <!-- サイコロボタン -->
              <div class="btn-container" v-bind:style="borderColor">
                  <button class="dice" @click="onClickDiceButton()">
                    <img src="../../images/diceImages/nomalDice.png" alt="" style="width: 150px; height: 150px;">
                    <p>さいころ</p>
                  </button>
              </div>
          </div>
      </div>

      <!-- アイテムボタン押下時のポップアップ -->
      <div id="item-mask" @click="() => { isItemDialog = false }" v-show="isItemDialog">
          <section id="item-modal" v-show="isItemDialog" v-bind:style="borderColor">
              <ul>
                  <div v-if="isItemAvailable">
                      <li v-for="itemDisplayData in itemDisplayDatas" :key="itemDisplayData.ID" class="item">
                          <button @click="onClickItemImg(itemDisplayData.ID)">
                            <div :class="itemDisplayData.class" alt=""></div>
                          </button>
                          <p>{{ itemDisplayData.name }}</p>
                          <div class="item__text"  @click="onClickItemImg(itemDisplayData.ID)">
                            <p>{{ itemDisplayData.description }}</p>
                          </div>
                      </li>
                  </div>
                  <div v-if="!(isItemAvailable)">
                      <li>アイテムは1ターンに1度しか使用できません</li>
                  </div>
              </ul>
          </section>
      </div>

      <!-- アイテムの効果対象プレイヤー選択のポップアップ -->
      <div id="target-mask" @click="() => { isTargetDialog = false }" v-show="isTargetDialog">
          <section id="target-modal" v-show="isTargetDialog" v-bind:style="borderColor">
              <p>対象を選択してね</p>
              <ul style="display: flex;">
                  <li v-for="targetDisplayData in targets" :key="targetDisplayData.playerID">
                      <button @click="onClickItemTarget(targetDisplayData.selectedItemID, targetDisplayData.playerID)">
                          <Player :playerID="targetDisplayData.playerID" :display="true" :playerClass="targetDisplayData.playerClass" class="target-player"></Player>
                      </button>
                      <div @click="onClickItemTarget(targetDisplayData.selectedItemID, targetDisplayData.playerID)">
                          <p style="width: 120px; overflow-wrap: break-word;">{{ targetDisplayData.playerName }}</p>
                      </div>
                  </li>
              </ul>
          </section>
      </div>

      <!-- サイコロボタン押下時のポップアップ -->
      <div id="dice-mask" @click="() => { isDiceDialog = false }" v-show="isDiceDialog">
          <section id="dice-modal" v-show="isDiceDialog" v-bind:style="borderColor">
              <ul>
                  <li v-for="(diceDisplayData, index) in diceDisplayDatas" :key="diceDisplayData.ID" class="dice">
                      <button @click="onClickDiceImg(diceDisplayData.ID)">
                        <div :class="diceDisplayData.class" alt=""></div>
                      </button>
                      <p>{{ diceDisplayData.name }}</p>
                      <div class="dice__text"  @click="onClickDiceImg(diceDisplayData.ID)">
                        <p>{{ diceDisplayData.description }}</p>
                      </div>
                  </li>
              </ul>
          </section>
      </div>
      
      <!-- マスイベント実行時のポップアップ -->
      <div id="dice-mask" @click="()=>{onClickCellEvent();isEventDialog=false;}" v-show="isEventDialog">
          <section id="dice-modal" v-show="isEventDialog" v-bind:style="borderColor">
              <p>
                  <!-- <span class="masu_name">ハプニングマス</span>
                  <span class="reason">急な筋肉痛で動けない!</span> -->
                  <span class="masu_action">{{ messageText }}</span>
              </p>
          </section>
      </div>

      <!-- マスイベント実行後のポップアップ -->
      <div id="dice-mask" @click="()=>{isEventFinishDialog = false;changeTurn();}" v-show="isEventFinishDialog">
          <section id="dice-modal" v-show="isEventFinishDialog" v-bind:style="borderColor">
              <p>
                  <!-- <span class="masu_name">ハプニングマス</span>
                  <span class="reason">急な筋肉痛で動けない!</span> -->
                  <span class="masu_action">{{ messageText }}</span>
              </p>
          </section>
      </div>

      <!-- プレイヤーゴール時のポップアップ -->
      <div id="dice-mask" @click="onClickResultButton()" v-show="isGoalDialog">
          <section id="dice-modal" v-show="isGoalDialog" v-bind:style="borderColor">
            <div class="goal-pop"><span class="name">{{ turnPlayerName }}</span>がゴール!</div>
            <button class="goal-button" onclick="hideDice()" id="close-button">
              つぎへ
            </button>
          </section> 
      </div>
  </body>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import * as sugoroku_ts from '../objects/sugoroku'
import * as player_ts from '../objects/player'
import * as cell_ts from '../objects/cell'
import Cell from './Cell.vue'
import Player from './Player.vue'

//プレイヤーの現在地
const locationIDArray = ref(player_ts.getLocationIDArray())

//全プレイヤーの情報を表示するためのデータを取得
const playerDisplayDatas = ref(player_ts.getPlayerDisplayData())

//ターンプレイヤーの所持するサイコロを表示するためのデータを取得
const diceDisplayDatas = ref(player_ts.getDiceDisplayData(sugoroku_ts.turnPlayerID))

//ターンプレイヤーの所持するアイテムを表示するためのデータを取得
const itemDisplayDatas = ref(player_ts.getItemDisplayData(sugoroku_ts.turnPlayerID))

//ターンプレイヤーの名前
const turnPlayerName = ref(player_ts.fetchPlayerName(sugoroku_ts.turnPlayerID))

//プレイヤーのゴールダイアログの表示管理
const isGoalDialog = ref(false)

//イベントダイアログの表示管理
const isEventDialog = ref(false)

//イベント終了時のダイアログの表示管理
const isEventFinishDialog = ref(false)

//メッセージテキスト
const messageText = ref("")



//サイコロダイアログの表示管理
const isDiceDialog = ref(false)
//サイコロボタン押下処理
const onClickDiceButton = () => {
  isDiceDialog.value = true
}

//サイコロImg押下処理
const onClickDiceImg = (selectedDice: number) => {

  //サイコロを回す処理
  if (sugoroku_ts.dealWithRollingDice(selectedDice)) {

      //プレイ画面の表示に必要な各種データの更新
      updateDisplayData()

      //ゴールダイアログを表示する
      isGoalDialog.value = true

  } else {
      //プレイ画面の表示に必要な各種データの更新
      updateDisplayData()

      //マスイベントボタン表示
      isEventDialog.value = true
  }
}

//マスイベントを実行しターンを終了
const onClickCellEvent = () => {
  //マスイベントを実行
  if(sugoroku_ts.excuteCellEvent()){
    //プレイ画面の表示に必要な各種データの更新
    updateDisplayData()
    
    isEventFinishDialog.value=true
  }else{
    changeTurn()
  }
}

//ターンを終了し、次のターンを開始する
const changeTurn=()=>{
  //ターンを終了する処理
  sugoroku_ts.endOfTurn()

  //ターンを開始する処理
  sugoroku_ts.startOfTurn()

  //プレイ画面の表示に必要な各種データの更新
  updateDisplayData()

  //アイテムを使用可能にする
  isItemAvailable.value = true
}

//アイテムの使用可否
const isItemAvailable = ref(true)

//アイテムダイアログの表示管理
const isItemDialog = ref(false)

//対象プレイヤー選択ダイヤログの表示管理
const isTargetDialog = ref(false)

// 対象プレイヤーの配列
type targetsType = Array<{
  playerID:number,
  playerName:String,
  playerClass:string,
  selectedItemID:number
}>
let targets:targetsType = []

//アイテムボタン押下処理
const onClickItemButton = () => {
  isItemDialog.value = true
}

/**
* アイテムImg押下処理
* @param selectedItem 選択したアイテムID
*/
const onClickItemImg = (selectedItem: number) => {
  // [仮設] マグネット選択時に対象プレーヤー選択ポップアップの表示
  // ※　現在はマグネットで対象を選択しても全員に効果が適用されます。
  // 　　引数 [targetPlayer] を利用することを推奨します。
  targets = [] // targets初期化
  for(let i=1;i<=player_ts.getPlayerObjectSize();i++){
    if(sugoroku_ts.turnPlayerID != i){
      targets.push({
        playerID:i,
        playerName:player_ts.fetchPlayerName(i),
        playerClass:player_ts.getIconConsideredCondition(i),
        selectedItemID:selectedItem
      })
    }
  }

  //対象プレイヤー選択ダイヤログの表示
  isTargetDialog.value = true
}

/**
 * アイテムの対象押下処理
 * @param selectedItem  選択したアイテムID
 * @param targetPlayer  対象プレイヤーID (0:全員)
 */
const onClickItemTarget = (selectedItem: number, targetPlayer: number)=>{
  //アイテム使用処理
  sugoroku_ts.dealWithUsingItem(selectedItem,targetPlayer)

  //プレイ画面の表示に必要な各種データの更新
  updateDisplayData()

  //アイテムを使用不可にする
  isItemAvailable.value = false

  //アイテムダイアログを非表示にする
  isItemDialog.value = false
}

const router = useRouter()
//リザルトボタン押下処理
const onClickResultButton = (): void => {
  //Result.vueへ画面遷移
  router.push("/Result")
}


/**
* プレイ画面の表示に必要な各種データの更新
* (プレイヤーの位置情報、ターンプレイヤー名、表示するメッセージテキスト、
* 全プレイヤーの情報、ターンプレイヤーの所持するサイコロ、アイテムの更新)
*/
const updateDisplayData = () => {

  //現在プレイヤーの位置に駒を表示する
  locationIDArray.value = player_ts.getLocationIDArray()

  //ターンプレイヤーの名前を更新
  turnPlayerName.value = player_ts.fetchPlayerName(sugoroku_ts.turnPlayerID)

  //表示するメッセージテキストを更新
  messageText.value = sugoroku_ts.messageText

  //全プレイヤーの情報を表示するためのデータを取得
  playerDisplayDatas.value = player_ts.getPlayerDisplayData()

  //ターンプレイヤーの所持するサイコロを表示するためのデータを取得
  diceDisplayDatas.value = player_ts.getDiceDisplayData(sugoroku_ts.turnPlayerID)

  //ターンプレイヤーの所持するアイテムを表示するためのデータを取得
  itemDisplayDatas.value = player_ts.getItemDisplayData(sugoroku_ts.turnPlayerID)

  borderColorUpdate()
}

//ボーダーの色をターンプレイヤーの色に変える
const borderColor = ref("red")
const borderColorUpdate = () => {
  if(sugoroku_ts.turnPlayerID == 1){
      borderColor.value = "border-color: red;"
  }else if(sugoroku_ts.turnPlayerID == 2){
      borderColor.value = "border-color: rgb(67, 241, 247);"
  }else if(sugoroku_ts.turnPlayerID == 3){
      borderColor.value = "border-color: yellow;"
  }else if(sugoroku_ts.turnPlayerID == 4){
      borderColor.value = "border-color: green;"
  }
}
</script>

<style scoped>
.board {
display: grid;
gap: 5em;
/* grid-template-columns: repeat(4, 1fr); */
grid-template-columns: repeat(4, 1fr);
grid-auto-rows: 100px;
grid-auto-flow: row dense;
justify-content: center;
padding: 3rem 15rem;
}

.tile {
border: 5px solid #40ff75;
position: relative;
justify-content: center;
text-align: center;
align-items: center;
background-color: white;
font-weight: bold;
height: 8rem;
width: 18rem;
border-radius: 10px;
display: flex;
flex-wrap: wrap;
justify-content: center;
}

.tile .event {
font-size: 30px;
margin: 0 80px;
}

.start {
display: flex;
position: relative;
justify-content: center;
align-items: center;
font-size: 30px;
font-weight: bold;
height: 8rem;
}

.goal {
display: flex;
position: relative;
justify-content: center;
align-items: center;
font-size: 30px;
font-weight: bold;
height: 8rem;
}

.board > *:nth-child(8n + 5) {
grid-column: 4;
}
.board > *:nth-child(8n + 6) {
grid-column: 3;
}
.board > *:nth-child(8n + 7) {
grid-column: 2;
}
.board > *:nth-child(8n + 8) {
grid-column: 1;
}

.board > *:nth-child(1)::after {
content: url("../../images/screenImages/right-arrow.png");
position: absolute;
right: 0;
transform: translateX(3rem);
}
.board > *:nth-child(2)::after {
content: url("../../images/screenImages/right-arrow.png");
position: absolute;
right: 0;
transform: translateX(3rem);
}
.board > *:nth-child(3)::after {
content: url("../../images/screenImages/right-arrow.png");
position: absolute;
right: 0;
transform: translateX(3rem);
}
.board > *:nth-child(4)::after {
content: url("../../images/screenImages/down-arrow.png");
position: absolute;
bottom: 0;
transform: translateY(2.5rem);
}
.board > *:nth-child(5)::before {
content: url("../../images/screenImages/left-arrow.png");
position: absolute;
left: 0;
transform: translateX(-3rem);
}
.board > *:nth-child(6)::before {
content: url("../../images/screenImages/left-arrow.png");
position: absolute;
left: 0;
transform: translateX(-3rem);
}
.board > *:nth-child(7)::before {
content: url("../../images/screenImages/left-arrow.png");
position: absolute;
left: 0;
transform: translateX(-3rem);
}
.board > *:nth-child(8)::after {
content: url("../../images/screenImages/down-arrow.png");
position: absolute;
bottom: 0;
transform: translateY(2.5rem);
}
.board > *:nth-child(9)::after {
content: url("../../images/screenImages/right-arrow.png");
position: absolute;
right: 0;
transform: translateX(3rem);
}
.board > *:nth-child(10)::after {
content: url("../../images/screenImages/right-arrow.png");
position: absolute;
right: 0;
transform: translateX(3rem);
}

.board > *:nth-child(11)::after {
content: url("../../images/screenImages/right-arrow.png");
position: absolute;
right: 0;
transform: translateX(3rem);
}

.piece1 {
background-image: url("../../images/playerImages/bird_red.png");
height: 50px;
width: 50px;
background-size: contain;
background-repeat: no-repeat;
}
.piece2 {
background-image: url("../../images/playerImages/bird_blue.png");
height: 50px;
width: 50px;
background-size: contain;
background-repeat: no-repeat;
}
.piece3 {
background-image: url("../../images/playerImages/bird_yellow.png");
height: 50px;
width: 50px;
background-size: contain;
background-repeat: no-repeat;
}
.piece4 {
background-image: url("../../images/playerImages/bird_green.png");
height: 50px;
width: 50px;
background-size: contain;
background-repeat: no-repeat;
}

.sleep::after {
content: url("../../images/playerImages/zzzx.png");
position: absolute;
transform: translate(10px, -35px);
}

.flex {
display: flex;
justify-content: center;
}

.score {
display: flex;
border: 5px solid #40ff75;
border-radius: 10px;
background-color: #fff;
margin: 2rem 5rem;
width: 430px;
height: 250px;
padding: 0.5em 1em;
position: absolute;
left: 50px;
text-align: center;
}

.score ul {
display: flex;
flex-direction: column;
justify-content: space-around;
flex: 1;
margin: 0;
padding: 0;
}

.score li {
display: flex;
}
/* 
.score li::before {
content: "";
display: inline-block;
height: 20px;
width: 20px;
border-radius: 50%;
position: relative;
top: 8px;
}
.score .active::before {
position: relative;
top: 15px;
}

.score li:nth-child(1):before {
background-color: red;
}

.score li:nth-child(2):before {
background-color: blue;
}

.score li:nth-child(3):before {
background-color: yellow;
}

.score li:nth-child(4):before {
background-color: purple;
} */

.score .name {
font-size: 1.5rem;
font-weight: 600;
margin: 0 30px;
}

.score .active .name {
font-size: 2rem;
}

.score .ato {
padding-left: 2em;
font-size: 8px;
}

.score .number {
font-size: 2rem;
display: flex;
align-items: center;
margin: 0 5px;
}
.score .active .number {
font-size: 3rem;
}
.score .left {
display: flex;
margin-left: auto;
}

.turn {
margin-top: 50px;
font-size: 3rem;
font-weight: bold;
text-align: center;
}

.buttons {
display: flex;
gap: 3em;
align-items: flex-end;
position: absolute;
right: 5rem;
margin: 2rem 5rem;
}
.buttons > * {
display: flex;
justify-content: center;
align-items: center;
border-radius: 50%;
background-color: white;
border: 5px solid red;
cursor: pointer;
}

.buttons .item {
height: 150px;
width: 150px;
background: transparent;
border: 2px solid transparent;
cursor: pointer;
}

.buttons .dice {
height: 250px;
width: 250px;
background: transparent;
border: 2px solid transparent;
cursor: pointer;
}

button:hover {
opacity: 0.7;
}

.item-hidden {
display: none;
}

/* ------------------------------
  アイテムポップアップ
------------------------------ */

.magnet {
background-image: url("../../images/itemImages/magnet.png");
width: 150px;
height: 150px;
margin: 50px 50px 0 50px;
object-fit: contain;
background-size: contain;
background-repeat: no-repeat;
}
.cyclone {
background-image: url("../../images/itemImages/cyclone.png");
width: 150px;
height: 150px;
margin: 50px 50px 0 50px;
object-fit: contain;
background-size: contain;
background-repeat: no-repeat;
}
.bomb {
background-image: url("../../images/itemImages/bomb.png");
width: 150px;
height: 150px;
margin: 50px 50px 0 50px;
object-fit: contain;
background-size: contain;
background-repeat: no-repeat;
}

#item-mask {
background: rgba(0, 0, 0, 0.7);
position: fixed;
top: 0;
bottom: 0;
right: 0;
left: 0;
z-index: 1;
}
#item-modal {
background: #fff;
width: 50%;
height: 50%;
padding: 24px;
border-radius: 4px;
position: fixed;
top: 10%;
left: 10%;
right: 10%;
text-align: center;
margin: 0 auto;
z-index: 2;
overflow: scroll;
border: 8px solid red;
font-size: 30px;
}
#item-modal img {
width: 150px;
height: 150px;
object-fit: contain;
margin: 50px 50px 0 50px;
}
li:hover {
cursor: pointer;
}
.item {
position: relative;
}
.item:hover .item__text {
opacity: 1;
}
.item__text {
position: absolute;
width: 100%;
height: 100%;
top: 0;
left: 0;
text-align: center;
color: #fff;
background-color: rgba(0, 0, 0, 0.6);
transition: 0.3s ease-in-out;
opacity: 0;
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
}
.item__text p {
line-height: 1.8;
}

.item__text p {
font-size: 20px;
}

#item-modal p {
text-align: center;
}
#item-modal ul {
display: flex;
flex-wrap: wrap;
justify-content: center;
}
#item-modal li {
list-style: none;
}

#target-mask {
background: rgba(0, 0, 0, 0.7);
position: fixed;
top: 0;
bottom: 0;
right: 0;
left: 0;
z-index: 1;
}

#target-modal {
background: #fff;
width: 50%;
height: 50%;
padding: 24px;
border-radius: 4px;
position: fixed;
top: 10%;
left: 10%;
right: 10%;
text-align: center;
margin: 0 auto;
z-index: 2;
overflow: scroll;
border: 8px solid red;
font-size: 30px;
}
#target-modal p {
text-align: center;
font-size: 1.8rem;
}
#target-modal ul {
display: flex;
flex-wrap: wrap;
padding-top: 100px;
justify-content: center;
}
#target-modal li {
padding: 0 30px;
list-style: none;
}
.target-player {
width: 120px;
height: 120px;
}

/* ------------------------------
  サイコロポップアップ
------------------------------ */

.nomalDice {
background-image: url("../../images/diceImages/nomalDice.png");
width: 150px;
margin: 50px;
height: 150px;
object-fit: contain;
background-size: contain;
background-repeat: no-repeat;
}
.bigDice {
background-image: url("../../images/diceImages/bigDice.png");
width: 150px;
margin: 50px;
height: 150px;
object-fit: contain;
background-size: contain;
background-repeat: no-repeat;
}
.doubleDice {
background-image: url("../../images/diceImages/doubleDice.png");
width: 150px;
margin: 50px;
height: 150px;
object-fit: contain;
background-size: contain;
background-repeat: no-repeat;
}

.dice-hidden {
display: none;
}
#dice-mask {
background: rgba(0, 0, 0, 0.7);
position: fixed;
top: 0;
bottom: 0;
right: 0;
left: 0;
z-index: 1;
}
#dice-modal {
  background: #fff;
  width: 50%;
  height: 50%;
  padding: 24px;
  border-radius: 4px;
  color: red;
  position: fixed;
  top: 10%;
  left: 10%;
  right: 10%;
  text-align: center;
  margin: 0 auto;
  z-index: 2;
  overflow: scroll;
  border: 8px solid red;
} 
#dice-modal img {
  width: 150px;
  margin: 50px;
  height: 150px;
  object-fit: contain;
}
#dice-modal p {
  text-align: center;
}
#dice-modal ul {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
#dice-modal li {
  list-style: none;
}
.dice {
position: relative;
}
.dice:hover .dice__text {
opacity: 1;
}
.dice__text {
position: absolute;
width: 100%;
height: 100%;
top: 0;
left: 0;
text-align: center;
color: #fff;
background-color: rgba(0, 0, 0, 0.6);
transition: 0.3s ease-in-out;
opacity: 0;
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
}
.dice__text p {
line-height: 1.8;
}

.dice__text p {
font-size: 20px;
}

/* ------------------------------
  マスイベント
------------------------------ */

.dice-hidden {
display: none;
}
#dice-mask {
background: rgba(0, 0, 0, 0.7);
position: fixed;
top: 0;
bottom: 0;
right: 0;
left: 0;
z-index: 1;
}
#dice-modal {
background: #fff;
width: 50%;
height: 500px;
padding: 24px;
border-radius: 30px;
position: fixed;
top: 10%;
left: 10%;
right: 10%;
margin: 0 auto;
z-index: 2;
border: 8px solid green;

}
#dice-modal p{
display:flex;
flex-flow: column;
}
#dice-modal p .masu_name {
font-size: 30px;
margin: 10px 0 50px 10px;
}
#dice-modal p .reason {
font-size: 60px;
text-align: center;
  margin: 10px 0 50px 10px;

}
#dice-modal p .masu_action {
font-size: 80px;
font-weight: 800;
text-align: center;
}

/* ------------------------------
  ゴールポップアップ
------------------------------ */
.dice-hidden {
display: none;
}
#dice-mask {
background: rgba(0, 0, 0, 0.7);
position: fixed;
top: 0;
bottom: 0;
right: 0;
left: 0;
z-index: 1;
}
#dice-modal {
background: #fff;
width: 50%;
height: 500px;
padding: 24px;
border-radius: 30px;
position: fixed;
top: 10%;
left: 10%;
right: 10%;
margin: 0 auto;
z-index: 2;
border: 8px solid;
}
.goal-pop {
margin-top: 100px;
text-align: center;
font-size: 60px;
font-weight: 800;
}
.goal-pop .name {
margin: 0 15px;
font-size: 80px;
font-weight: 800;
}

.goal-button {
background-color: #ffd600;
position: absolute;
border: 2px solid transparent;
top: 80%;
left: 50%;
transform: translate(-50%, -50%);
font-size: 45px;
font-weight: 700;
color: #fff;
padding: 10px 50px;
border-radius: 30px;
}

.goal-button:hover {
font-size: 55px;
cursor: pointer;
}
</style>