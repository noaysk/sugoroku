<script setup lang="ts">
import {ref} from 'vue';

/**
 * 親コンポーネント(Tile.vue)から渡される値
 * @param playerID  playerPlace / プレイヤーの現在地
 * @param display /表示するかどうか
 * @param playerClass / プレイヤーのアイコン
 */
 const props = defineProps({
    playerID: Number,
    display: Boolean,
    playerClass: String
})

const playerClass=ref(props.playerClass)

</script>

<template>
    <div v-if="display" :class="playerClass"></div>
</template>

<style>
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

    .sleep::after {
        content: url("../../images/playerImages/zzzx.png");
        position: absolute;
        transform: translate(10px, -35px);
    }
</style>