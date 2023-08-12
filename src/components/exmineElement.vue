<template>
    >移動前<div id="cell1"><img src="../../王将イラスト.png" id="ousyou"><img src="../../角行イラスト.png" id="kaku"><img src="../../飛車イラスト.png" id="hisya"></div>
    >移動後<div id="cell2"></div>
    <button @click="onClickOusyouButton()">王将を移動</button>
    <button @click="onClickKakuButton()">角行を移動</button>
    <button @click="onClickHisyaButton()">飛車を移動</button>
</template>


<script setup lang="ts">
    import { ref } from 'vue'
    import { useRouter } from 'vue-router'

    const onClickOusyouButton=()=>{
        const cell1 = document.getElementById("cell1")
        const cell2 = document.getElementById("cell2")
        const ousyou = document.getElementById("ousyou")
        if(ousyou){
            cell1?.removeChild(ousyou)
        }

        const img = document.createElement("img")
        img.setAttribute("src","../../王将イラスト.png")
        cell2?.appendChild(img)
    }
    const onClickKakuButton=()=>{
        const cell1 = document.getElementById("cell1")
        const cell2 = document.getElementById("cell2")
        const kaku = document.getElementById("kaku")
        if(kaku){
            cell1?.removeChild(kaku)
        }

        const img = document.createElement("img")
        img.setAttribute("src","../../角行イラスト.png")
        cell2?.appendChild(img)
    }
    const onClickHisyaButton=()=>{
        const cell1 = document.getElementById("cell1")
        const cell2 = document.getElementById("cell2")
        const hisya = document.getElementById("hisya")
        if(hisya){
            cell1?.removeChild(hisya)
        }

        const img = document.createElement("img")
        img.setAttribute("src","../../飛車イラスト.png")
        cell2?.appendChild(img)
    }
    const router = useRouter()

</script>

<style>
img{
    width: 80px;
}
#cell1{
    width: 400px;
    height: 400px;
    background-color: aqua;
}
#cell2{
    width: 400px;
    height: 400px;
    background-color:chartreuse;
}
</style>