<template>
    <div class="tile">
        <p class="event">{{ cellText }}</p>
        <div class="flex">
            <player v-for="piece of pieces" :playerID="piece.playerID"  :display="piece.display" :playerClass="piece.playerClass"></player>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import Player from './Player.vue'
import * as player_ts from '../objects/player'

/**
 * 親コンポーネント(Board.vue)からリアクティブに渡される値
 * @param cellID           cellID      / マスのID
 * @param cellText         cellText   / マスのテキスト
 * @param locationIDArray  locationIDArray / プレイヤーの現在地
 */
const props = defineProps({
    cellID: Number,
    cellText: String,
    locationIDArray: Array
})

/**
 * プレイヤーの現在地がマスの番号(cellID)と一致したら true を返す
 * ※ 現在プレイヤーの位置情報を配列で仮設しているので、プレイヤーデータの管理場所を変えた際は注意が必要
 * @param playerLocationIndex 0:player1, 1:player2, 2:player3, 3:player4
 */
const isPieceOnCell = (playerLocationIndex:number):boolean => {
    if(props?.locationIDArray){
        if(props.locationIDArray[playerLocationIndex] === props.cellID){//props.cellIDが文字列に変換されてしまっている　要改善
            return true
        }else{
            return false
        }
    }
    console.log("locationIDArrayがundefinedです")
    return false
}

// プレイヤー1,2,3,4それぞれで isPieceOnCell() を実行
type piecesType = Array<{
    playerID:number,
    display:boolean,
    playerClass:string,
}>
const pieces:piecesType = []
for(let i=1;i<=player_ts.getPlayerObjectSize();i++){
    const piece = computed(() => isPieceOnCell(i-1))
    pieces.push({
        playerID:i, 
        display:piece.value, 
        playerClass:player_ts.getIconConsideredCondition(i)
    })
}

//propsの値の変化を感知して実行、駒の位置を変更する
watch(props,()=>{
    for(let i=1;i<=player_ts.getPlayerObjectSize();i++){
        const piece = computed(() => isPieceOnCell(i-1))
        pieces[i-1].display = piece.value
        pieces[i-1].playerClass = player_ts.getIconConsideredCondition(i)
    }
})
</script>

<style>
.tile {
    border: 5px solid #40ff75;
    display: flex;
    position: relative;
    justify-content: center;
    align-items: center;
    background-color: white;
    font-weight: bold;
    height: 8rem;
    border-radius: 10px;
}

.flex {
  display: flex;
  justify-content: center;
}

.tile .event {
  font-size: 30px;
  margin: 0 45px;
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
</style>