<template>
    <head>
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>

    <div class="container">
      <h1>プレイヤー設定</h1>
      <h2>~人数~</h2>
      <div class="buttons">
        <button class="angle" type="button" @click="onClickDeletePlayerButton()"> &lt; </button>
        <span class="player-num" id="player-num">{{playerCount}}</span>
        <button class="angle" type="button" @click="onClickAddPlayerButton()"> &gt; </button>
      </div>
      <div v-for="playerName,index in playerNames" :key="index"  id="players" class="players">
        <input type="text" v-model="playerNames[index]" placeholder="なまえ"/>
      </div>
      <button type="button" class="start" @click="onClickStartButton()">ゲーム開始</button>
    </div>
  </body>
  
    <!-- <p>参加するプレイヤーの名前を入力してください。(最大{{MAX_PLAYER_NUMBER}}名)</p>
    <div v-for="playerName,index in playerNames" :key="index">
        <input type="text" v-model="playerNames[index]">
    </div>
    <button @click="onClickAddPlayerButton()" v-show="addButtonFlag">＋</button>
    <button @click="onClickDeletePlayerButton()" v-show="deleteButtonFlag">－</button>
    <button @click="onClickStartButton()">開始</button> -->
</template>

<script setup lang="ts">
    import { ref, watch } from 'vue'
    import { useRouter } from 'vue-router'
    import { addPlayerObject,setPlayerName,MAX_PLAYER_NUMBER} from '../objects/player'

    //入力されたプレイヤー名を保持する配列
    //(初めに表示されるテキストボックスの数を変更する場合この配列の要素を増減すればよい)
    const playerNames = ref(["","",""])
    const playerCount = ref(playerNames.value.length)

    //プレイヤー追加ボタン押下処理
    const onClickAddPlayerButton=()=>{
        if(playerNames.value.length <= MAX_PLAYER_NUMBER-1){
            playerCount.value++
            playerNames.value.push("")
        }
    }

    //プレイヤー削除ボタン押下処理
    const onClickDeletePlayerButton=()=>{
        if(playerNames.value.length >= 3){
            playerCount.value--
            playerNames.value.pop()
        }   
    }

    const router = useRouter()

    //開始ボタン押下処理
    const onClickStartButton=()=>{

        //参加人数
        let joinPlayerCount = 0
        //入力されたプレイヤー名の配列(空文字が入力された場合は除外)
        const playerNameArray:Array<string> = []

        playerNames.value.forEach((playerName)=>{
            if(playerName !== ""){
                joinPlayerCount++
                playerNameArray.push(playerName)
            }
        })
        
        //参加人数が2人以上ならプレイ画面に遷移する
        if(joinPlayerCount >= 2){
            //プレイヤーオブジェクトを参加人数だけ生成
            addPlayerObject(joinPlayerCount)

            //テキストボックスへの入力をもとにプレイヤーの名前を決定する
            //(上から入力されている順にplayer1,player2,player3,,,とする)
            playerNameArray.forEach((playerName,index) =>{
                setPlayerName(playerName,index+1)
            })

            //Play.vueへ画面を切り替える
            router.push("/Board")
        }
    }
</script>

<style scoped>
body {
    display: flex;
    justify-content: center;
}
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

.container {
    margin-top: 5em;
    display:flex;
    gap: 2em;
    align-items: center;
    flex-direction: column;
    max-width: 400px;
    
}
.angle{
    font-size: 45px;
    font-weight: 700;
}

.buttons {
    display: flex;
}

.player-num{
    font-size: 45px;
    font-weight: 700;
    margin: 0 30px;
}
.players {
    display: flex;
    flex-direction: column;
    gap: 1em;
    
}

.players input {
    padding: 0.4em 1em;
    border-radius: 5px;
    border: none;
    width: 600px;
    height: 50px;
}
input::placeholder {
    font-size: 15px;
    
   }

button {
    display: flex;
    border: none;
    background-color: transparent;
    justify-content: center;
    align-items: center;
    cursor: pointer;
}


.start {
    position: absolute;
    background: #40FF75;
    border: 2px solid transparent;
    top: 80%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 30px;
    font-weight: 700;
    color: #fff;
    padding: 1rem 5rem;
    border-radius: 8px;

  }
  .start:hover {
    font-size: 40px;
    cursor: pointer;
  }
</style>