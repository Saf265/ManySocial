"use client";

import {
  Check,
  ChevronRight,
  Cloud,
  FileVideo,
  Layout,
  Link as LinkIcon
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-hot-toast";

// Mock Data for Background Videos
const backgroundVideos = [
  // MINECRAFT ------------------------------------------------------------------------------------------------------------------------------
  { 
    id: 1, 
    name: "Minecraft Video", 
    duration: "2 mins", 
    size: "100.95 MO", 
    author: "Steve", 
    authorPicUrl: "https://minecraftpfp.com/api/pfp/null.png",
    videoUrl: "https://res.cloudinary.com/dotihphpy/video/upload/q_auto/v1765483170/Minecraft_-_1_-_Blur_kgteas.mp4", // Placeholder
    thumbnail: "https://res.cloudinary.com/dotihphpy/image/upload/q_auto/v1765483171/Minecraft_-_Picture_-_1_-_Blur_pnhvlu.png",
    preniumGameplayLink: "https://premiumgameplay.com/explore?id=lsk7jxtr-9ucu-f7ek-w02f-qxaia2bzf0p"
  },
  { 
    id: 2, 
    name: "Minecraft Video", 
    duration: "3 mins", 
    size: "103.63 MO", 
    author: "Steve",
    authorPicUrl: "https://minecraftpfp.com/api/pfp/null.png",
    videoUrl: "https://res.cloudinary.com/dotihphpy/video/upload/q_auto/v1765483168/Minecraft_-_2_-_Blur_miufdd.mp4", 
    thumbnail: "https://res.cloudinary.com/dotihphpy/image/upload/q_auto/v1765483169/Minecraft_-_Picture_-_2_-_Blur_yvkyeb.png",
    preniumGameplayLink: "https://premiumgameplay.com/explore?id=73xdhodn-7bfm-8xu6-u4fr-sbejimmngz"
  },
  { 
    id: 3, 
    name: "Minecraft Video", 
    duration: "3 mins", 
    size: "133.32 MO", 
    author: "Steve", 
    authorPicUrl: "https://minecraftpfp.com/api/pfp/null.png",
    videoUrl: "https://res.cloudinary.com/dotihphpy/video/upload/q_auto/v1765483165/Minecraft_-_3_-_Blur_tsg05i.mp4", 
    thumbnail: "https://res.cloudinary.com/dotihphpy/image/upload/q_auto/v1765483166/Minecraft_-_Picture_-_3_-_Blur_z2crp0.png",
    preniumGameplayLink: "https://premiumgameplay.com/explore?id=0xacedg7-9dp8-8p3s-53zy-vt35lqhy0ml"
  },
  { 
    id: 4, 
    name: "Minecraft Video", 
    duration: "2 mins", 
    size: "94.99 MO", 
    author: "Steve", 
    authorPicUrl: "https://minecraftpfp.com/api/pfp/null.png",
    videoUrl: "https://res.cloudinary.com/dotihphpy/video/upload/q_auto/v1765483162/Minecraft_-_4_-_Blur_czfvkh.mp4", 
    thumbnail: "https://res.cloudinary.com/dotihphpy/image/upload/q_auto/v1765483164/Minecraft_-_Picture_-_4_-_Blur_p0l40o.png",
    preniumGameplayLink: "https://premiumgameplay.com/explore?id=1s739e44-vipb-57t9-5jqa-a14rqcc4upw" 
  },
  { 
    id: 5, 
    name: "Minecraft Video", 
    duration: "3 mins", 
    size: "157.31 MO", 
    author: "Steve", 
    authorPicUrl: "https://minecraftpfp.com/api/pfp/null.png",
    videoUrl: "https://res.cloudinary.com/dotihphpy/video/upload/q_auto/v1765483161/Minecraft_-_5_-_Blur_j3kwnh.mp4", 
    thumbnail: "https://res.cloudinary.com/dotihphpy/image/upload/q_auto/v1765483162/Minecraft_-_Picture_-_5_-_Blur_upvsxf.png",
    preniumGameplayLink: "https://premiumgameplay.com/explore?id=o2cgsp82-1g9f-n3bb-a2tb-0wfuec7gc6ml" 
  },
  { 
    id: 6, 
    name: "Minecraft Video", 
    duration: "3 mins", 
    size: "166.78 MO", 
    author: "Steve", 
    authorPicUrl: "https://minecraftpfp.com/api/pfp/null.png",
    videoUrl: "https://res.cloudinary.com/dotihphpy/video/upload/q_auto/v1765483159/Minecraft_-_6_-_Blur_zhydzn.mp4", 
    thumbnail: "https://res.cloudinary.com/dotihphpy/image/upload/q_auto/v1765483159/Minecraft_-_Picture_-_6_-_Blur_fmfybq.png",
    preniumGameplayLink: "https://premiumgameplay.com/explore?id=ny7ujqdv-j2xm-45un-nap1-p3gpfdipjc" 
  },
   { 
    id: 7, 
    name: "Minecraft Video", 
    duration: "3 mins", 
    size: "145.58 MO", 
    author: "Steve", 
    authorPicUrl: "https://minecraftpfp.com/api/pfp/null.png",
    videoUrl: "https://res.cloudinary.com/dotihphpy/video/upload/q_auto/v1765483159/Minecraft_-_7_-_Blur_yydqty.mp4", 
    thumbnail: "https://res.cloudinary.com/dotihphpy/image/upload/q_auto/v1765483158/Minecraft_-_Picture_-_7_-_Blur_iedavu.png",
    preniumGameplayLink: "https://premiumgameplay.com/explore?id=y0zsrrwa-yiws-x0sf-hrh0-5gmwyv8qiq" 
  },
   { 
    id: 8, 
    name: "Minecraft Video", 
    duration: "3 mins", 
    size: "134.13 MO", 
    author: "Steve", 
    authorPicUrl: "https://minecraftpfp.com/api/pfp/null.png",
    videoUrl: "https://res.cloudinary.com/dotihphpy/video/upload/q_auto/v1765483155/Minecraft_-_8_-_Blur_ol2uy8.mp4", 
    thumbnail: "https://res.cloudinary.com/dotihphpy/image/upload/q_auto/v1765483156/Minecraft_-_Picture_-_8_-_Blur_pqppe7.png",
    preniumGameplayLink: "https://premiumgameplay.com/explore?id=ckti4s8v-7qh7-nuvd-uw42-nemdnedprcl" 
  },
  // MARIO KART ------------------------------------------------------------------------------------------------------------------------------
    { 
    id: 9, 
    name: "Mario Kart", 
    duration: "3 mins", 
    size: "458.25 MO", 
    author: "Mario", 
    authorPicUrl: "https://i.pinimg.com/736x/8a/79/5d/8a795df46777227e009cf7e3738ee07f.jpg",
    videoUrl: "https://res.cloudinary.com/dotihphpy/video/upload/q_auto/v1765483131/Mario_Kart_-_1_-_Blur_simvx9.mp4", 
    thumbnail: "https://res.cloudinary.com/dotihphpy/image/upload/q_auto/v1765483132/Mario_Kart_-_Picture_-_1_-_Blur_xlu1x6.png",
    preniumGameplayLink: "https://premiumgameplay.com/explore?id=1idc8qo6-2w9u-5eud-xwm2-nkaqgww6egm" 
  },
     { 
    id: 10, 
    name: "Mario Kart", 
    duration: "2 mins", 
    size: "321.69 MO", 
    author: "Mario", 
    authorPicUrl: "https://i.pinimg.com/736x/8a/79/5d/8a795df46777227e009cf7e3738ee07f.jpg",
    videoUrl: "https://res.cloudinary.com/dotihphpy/video/upload/q_auto/v1765483130/Mario_Kart_-_2_-_Blur_xwcb6c.mp4", 
    thumbnail: "https://res.cloudinary.com/dotihphpy/image/upload/q_auto/v1765483131/Mario_Kart_-_2_-_Picture_-_Blur_wn94lw.png",
    preniumGameplayLink: "https://premiumgameplay.com/explore?id=w5qikb8i-4kaf-io4k-ctlm-gewivgyrfy9" 
  },
     { 
    id: 11, 
    name: "Mario Kart", 
    duration: "3 mins", 
    size: "467.15 MO", 
    author: "Mario", 
    authorPicUrl: "https://i.pinimg.com/736x/8a/79/5d/8a795df46777227e009cf7e3738ee07f.jpg",
    videoUrl: "https://res.cloudinary.com/dotihphpy/video/upload/q_auto/v1765483128/Mario_Kart_-_3_-_Blur_mtjaqr.mp4", 
    thumbnail: "https://res.cloudinary.com/dotihphpy/image/upload/q_auto/v1765483129/Mario_Kart_-_3_-_Picture_-_Blur_wpsp9u.png",
    preniumGameplayLink: "https://premiumgameplay.com/explore?id=68bki2q6-vgfa-2q5b-fpoe-jiwjnaj2s4" 
  },
     { 
    id: 12, 
    name: "Mario Kart", 
    duration: "3 mins", 
    size: "502.06 MO", 
    author: "Mario", 
    authorPicUrl: "https://i.pinimg.com/736x/8a/79/5d/8a795df46777227e009cf7e3738ee07f.jpg",
    videoUrl: "https://res.cloudinary.com/dotihphpy/video/upload/q_auto/v1765483126/Mario_Kart_-_4_-_Blur_odx9hr.mp4", 
    thumbnail: "https://res.cloudinary.com/dotihphpy/image/upload/q_auto/v1765483127/Mario_Kart_-_4_-_Picture_-_Blur_lwl4fu.png",
    preniumGameplayLink: "https://premiumgameplay.com/explore?id=rof5zws9-nex0-m87x-79b8-zvbx8n2shjq" 
  },
     { 
    id: 13, 
    name: "Mario Kart", 
    duration: "3 mins", 
    size: "478.61 MO", 
    author: "Mario", 
    authorPicUrl: "https://i.pinimg.com/736x/8a/79/5d/8a795df46777227e009cf7e3738ee07f.jpg",
    videoUrl: "https://res.cloudinary.com/dotihphpy/video/upload/q_auto/v1765483124/Mario_Kart_-_5_-_Blur_hrcv46.mp4", 
    thumbnail: "https://res.cloudinary.com/dotihphpy/image/upload/q_auto/v1765483125/Mario_Kart_-_5_-_Picture_-_Blur_zodq2y.png",
    preniumGameplayLink: "https://premiumgameplay.com/explore?id=osbra44v-zlth-xm5y-ouh3-r9en9v7m4yr" 
  },
     { 
    id: 14, 
    name: "Mario Kart", 
    duration: "3 mins", 
    size: "477.15 MO", 
    author: "Mario", 
    authorPicUrl: "https://i.pinimg.com/736x/8a/79/5d/8a795df46777227e009cf7e3738ee07f.jpg",
    videoUrl: "https://res.cloudinary.com/dotihphpy/video/upload/q_auto/v1765483123/Mario_Kart_-_6_-_Blur_sjewkv.mp4", 
    thumbnail: "https://res.cloudinary.com/dotihphpy/image/upload/q_auto/v1765483123/Mario_Kart_-_6_-_Picture_-_Blur_opj8we.png",
    preniumGameplayLink: "https://premiumgameplay.com/explore?id=6jww7z18-spei-32kn-9u6l-hm8rq6oq66n" 
  },
     { 
    id: 15, 
    name: "Mario Kart", 
    duration: "3 mins", 
    size: "472.15 MO", 
    author: "Mario", 
    authorPicUrl: "https://i.pinimg.com/736x/8a/79/5d/8a795df46777227e009cf7e3738ee07f.jpg",
    videoUrl: "https://res.cloudinary.com/dotihphpy/video/upload/q_auto/v1765483121/Mario_Kart_-_7_-_Blur_qbzowk.mp4", 
    thumbnail: "https://res.cloudinary.com/dotihphpy/image/upload/q_auto/v1765483122/Mario_Kart_-_7_-_Picture_-_Blur_m26twu.png",
    preniumGameplayLink: "https://premiumgameplay.com/explore?id=slq9ce3v-in4r-h2p7-wnzz-te3cw82dote" // here 
  },
     { 
    id: 16, 
    name: "Mario Kart", 
    duration: "3 mins", 
    size: "477.22 MO", 
    author: "Mario", 
    authorPicUrl: "https://i.pinimg.com/736x/8a/79/5d/8a795df46777227e009cf7e3738ee07f.jpg",
    videoUrl: "https://res.cloudinary.com/dotihphpy/video/upload/q_auto/v1765483121/Mario_Kart_-_8_-_Blur_oabqeu.mp4", 
    thumbnail: "https://res.cloudinary.com/dotihphpy/image/upload/q_auto/v1765483121/Mario_Kart_-_8_-_Picture_-_Blur_njqxuc.png",
    preniumGameplayLink: "https://premiumgameplay.com/explore?id=i3gna72a-l15m-aesk-igxu-pf0w7s748p" 
  },
  // SUBWAY SURFER ------------------------------------------------------------------------------------------------------------------------------
    { 
    id: 17, 
    name: "Subway Surfer", 
    duration: "3 mins", 
    size: "377.65 MO", 
    author: "Jakey", 
    authorPicUrl: "https://64.media.tumblr.com/8e073c3c73202376a83e782c25fc3012/163239d388b24cef-77/s640x960/a7ce4408f438a78ddc2e8011589a31c54215b2b8.jpg",
    videoUrl: "https://res.cloudinary.com/dotihphpy/video/upload/q_auto/v1765483248/Subway_Surfer_-_1_-_Blur_dot94v.mp4", 
    thumbnail: "https://res.cloudinary.com/dotihphpy/image/upload/q_auto/v1765483249/Subway_Surfer_-_Picture_-_1_-_Blur_nuypri.png",
    preniumGameplayLink: "https://premiumgameplay.com/explore?id=24fmrp9x-0hak-r5rd-7nft-652n4dvo2y5" 
  },
    { 
    id: 18, 
    name: "Subway Surfer", 
    duration: "3 mins", 
    size: "355.84 MO", 
    author: "Jakey", 
    authorPicUrl: "https://64.media.tumblr.com/8e073c3c73202376a83e782c25fc3012/163239d388b24cef-77/s640x960/a7ce4408f438a78ddc2e8011589a31c54215b2b8.jpg",
    videoUrl: "https://res.cloudinary.com/dotihphpy/video/upload/q_auto/v1765483244/Subway_Surfer_-_2_-_Blur_hhjvse.mp4", 
    thumbnail: "https://res.cloudinary.com/dotihphpy/image/upload/q_auto/v1765483246/Subway_Surfer_-_Picture_-_2_-_Blur_f5fiub.png",
    preniumGameplayLink: "https://premiumgameplay.com/explore?id=jry0fmwn-72p2-7u5h-j73f-jnkwby5if89" 
  },
    { 
    id: 19, 
    name: "Subway Surfer", 
    duration: "3 mins", 
    size: "481.97 MO", 
    author: "Jakey", 
    authorPicUrl: "https://64.media.tumblr.com/8e073c3c73202376a83e782c25fc3012/163239d388b24cef-77/s640x960/a7ce4408f438a78ddc2e8011589a31c54215b2b8.jpg",
    videoUrl: "https://res.cloudinary.com/dotihphpy/video/upload/q_auto/v1765483240/Subway_Surfer_-_3_-_Blur_uh5cqm.mp4", 
    thumbnail: "https://res.cloudinary.com/dotihphpy/image/upload/q_auto/v1765483242/Subway_Surfer_-_Picture_-_3_-_Blur_tcfqxb.png",
    preniumGameplayLink: "https://premiumgameplay.com/explore?id=80pe0j5l-jmij-l91p-hpag-wy3uytgas1l" 
  },
    { 
    id: 20, 
    name: "Subway Surfer", 
    duration: "3 mins", 
    size: "377.15 MO", 
    author: "Jakey", 
    authorPicUrl: "https://64.media.tumblr.com/8e073c3c73202376a83e782c25fc3012/163239d388b24cef-77/s640x960/a7ce4408f438a78ddc2e8011589a31c54215b2b8.jpg",
    videoUrl: "https://res.cloudinary.com/dotihphpy/video/upload/q_auto/v1765483238/Subway_Surfer_-_4_-_Blur_aefn9v.mp4", 
    thumbnail: "https://res.cloudinary.com/dotihphpy/image/upload/q_auto/v1765483239/Subway_Surfer_-_Picture_-_4_-_Blur_pcrsyp.png",
    preniumGameplayLink: "https://premiumgameplay.com/explore?id=qdi29bi2-zzok-4vii-0yar-445ymesnwfj" 
  },
    { 
    id: 21, 
    name: "Subway Surfer", 
    duration: "3 mins", 
    size: "366.47 MO", 
    author: "Jakey", 
    authorPicUrl: "https://64.media.tumblr.com/8e073c3c73202376a83e782c25fc3012/163239d388b24cef-77/s640x960/a7ce4408f438a78ddc2e8011589a31c54215b2b8.jpg",
    videoUrl: "https://res.cloudinary.com/dotihphpy/video/upload/q_auto/v1765483234/Subway_Surfer_-_5_-_Blur_taogfa.mp4", 
    thumbnail: "https://res.cloudinary.com/dotihphpy/image/upload/q_auto/v1765483236/Subway_Surfer_-_Picture_-_5_-_Blur_jupypq.png",
    preniumGameplayLink: "https://premiumgameplay.com/explore?id=s06n9yfy-y8ag-zjuv-y8ta-7pgx13o95uh" 
  },
    { 
    id: 22, 
    name: "Subway Surfer", 
    duration: "3 mins", 
    size: "518.87 MO", 
    author: "Jakey", 
    authorPicUrl: "https://64.media.tumblr.com/8e073c3c73202376a83e782c25fc3012/163239d388b24cef-77/s640x960/a7ce4408f438a78ddc2e8011589a31c54215b2b8.jpg",
    videoUrl: "https://res.cloudinary.com/dotihphpy/video/upload/q_auto/v1765483232/Subway_Surfer_-_6_-_Blur_ftl5sa.mp4", 
    thumbnail: "https://res.cloudinary.com/dotihphpy/image/upload/q_auto/v1765483233/Subway_Surfer_-_Picture_-_6_-_Blur_iejlqo.png",
    preniumGameplayLink: "https://premiumgameplay.com/explore?id=cv1a0vhh-xt5s-vgmz-tweq-4lrzyf41g0s" 
  },
    { 
    id: 23, 
    name: "Subway Surfer", 
    duration: "3 mins", 
    size: "535.52 MO", 
    author: "Jakey", 
    authorPicUrl: "https://64.media.tumblr.com/8e073c3c73202376a83e782c25fc3012/163239d388b24cef-77/s640x960/a7ce4408f438a78ddc2e8011589a31c54215b2b8.jpg",
    videoUrl: "https://res.cloudinary.com/dotihphpy/video/upload/q_auto/v1765483229/Subway_Surfer_-_7_-_Blur_hid0lm.mp4", 
    thumbnail: "https://res.cloudinary.com/dotihphpy/image/upload/q_auto/v1765483230/Subway_Surfer_-_Picture_-_7_-_Blur_rmu7pm.png",
    preniumGameplayLink: "https://premiumgameplay.com/explore?id=00eieqe3-po4g-rh90-888c-zriwtgl77k" 
  },
    { 
    id: 24, 
    name: "Subway Surfer", 
    duration: "3 mins", 
    size: "474.25 MO", 
    author: "Jakey", 
    authorPicUrl: "https://64.media.tumblr.com/8e073c3c73202376a83e782c25fc3012/163239d388b24cef-77/s640x960/a7ce4408f438a78ddc2e8011589a31c54215b2b8.jpg",
    videoUrl: "https://res.cloudinary.com/dotihphpy/video/upload/q_auto/v1765483227/Subway_Surfer_-_8_-_Blur_ile0n3.mp4", 
    thumbnail: "https://res.cloudinary.com/dotihphpy/image/upload/q_auto/v1765483227/Subway_Surfer_-_Picture_-_8_-_Blur_qsuglc.png",
    preniumGameplayLink: "https://premiumgameplay.com/explore?id=dfstb466-kjpc-j3rq-ksdn-xsxplx8cuxi" 
  },
  // CLUSTER TRUCK ------------------------------------------------------------------------------------------------------------------------------
  { 
    id: 25, 
    name: "Cluster Truck", 
    duration: "2 mins", 
    size: "225.21 MO", 
    author: "Daryl", 
    authorPicUrl: "https://ms.yugipedia.com//thumb/e/ec/Truck_driver.png/257px-Truck_driver.png",
    videoUrl: "https://res.cloudinary.com/dotihphpy/video/upload/q_auto/v1765483095/Cluster_Truck_-_1_-_Blur_jl6yds.mp4", 
    thumbnail: "https://res.cloudinary.com/dotihphpy/image/upload/q_auto/v1765483095/Cluster_Truck_-_Picture_-_1_-_Blur_z5zfj6.png",
    preniumGameplayLink: "https://premiumgameplay.com/explore?id=7y5xzx2c-87p9-lzai-b90x-d536u9bwb4m" 
  },
    { 
    id: 26, 
    name: "Cluster Truck", 
    duration: "2 mins", 
    size: "318.80 MO", 
    author: "Daryl", 
    authorPicUrl: "https://ms.yugipedia.com//thumb/e/ec/Truck_driver.png/257px-Truck_driver.png",
    videoUrl: "https://res.cloudinary.com/dotihphpy/video/upload/q_auto/v1765483094/Cluster_Truck_-_2_-_Blur_fkbk0e.mp4", 
    thumbnail: "https://res.cloudinary.com/dotihphpy/image/upload/q_auto/v1765483094/Cluster_Truck_-_Picture_-_2_-_Blur_pi0fs6.png",
    preniumGameplayLink: "https://premiumgameplay.com/explore?id=q9jqkz36-cvql-hxpi-czb9-y0808t898h" 
  },
    { 
    id: 27, 
    name: "Cluster Truck", 
    duration: "2 mins", 
    size: "316.10 MO", 
    author: "Daryl", 
    authorPicUrl: "https://ms.yugipedia.com//thumb/e/ec/Truck_driver.png/257px-Truck_driver.png",
    videoUrl: "https://res.cloudinary.com/dotihphpy/video/upload/q_auto/v1765483094/Cluster_Truck_-_3_-_Blur_as46li.mp4", 
    thumbnail: "https://res.cloudinary.com/dotihphpy/image/upload/q_auto/v1765483094/Cluster_Truck_-_Picture_-_3_-_Blur_u2sx7r.png",
    preniumGameplayLink: "https://premiumgameplay.com/explore?id=nzcozcth-z7vd-fv40-w97t-h1p68vfjpfi" 
  },
    { 
    id: 28, 
    name: "Cluster Truck", 
    duration: "2 mins", 
    size: "317.36 MO", 
    author: "Daryl", 
    authorPicUrl: "https://ms.yugipedia.com//thumb/e/ec/Truck_driver.png/257px-Truck_driver.png",
    videoUrl: "https://res.cloudinary.com/dotihphpy/video/upload/q_auto/v1765483093/Cluster_Truck_-_4_-_Blur_xd4dtc.mp4", 
    thumbnail: "https://res.cloudinary.com/dotihphpy/image/upload/q_auto/v1765483093/Cluster_Truck_-_Picture_-_4_-_Blur_fzktpg.png",
    preniumGameplayLink: "https://premiumgameplay.com/explore?id=756xei5z-xez8-oud4-ykqs-6fstwtd641y" 
  },
    { 
    id: 29, 
    name: "Cluster Truck", 
    duration: "2 mins", 
    size: "319.52 MO", 
    author: "Daryl", 
    authorPicUrl: "https://ms.yugipedia.com//thumb/e/ec/Truck_driver.png/257px-Truck_driver.png",
    videoUrl: "https://res.cloudinary.com/dotihphpy/video/upload/q_auto/v1765483092/Cluster_Truck_-_5_-_Blur_rcqrb3.mp4", 
    thumbnail: "https://res.cloudinary.com/dotihphpy/image/upload/q_auto/v1765483092/Cluster_Truck_-_Picture_-_5_-_Blur_cwctqa.png",
    preniumGameplayLink: "https://premiumgameplay.com/explore?id=0pjaypo0-34o2-h5is-qo56-4r73mfmvh9y" 
  },

    { 
    id: 30, 
    name: "Cluster Truck", 
    duration: "2 mins", 
    size: "317.52 MO", 
    author: "Daryl", 
    authorPicUrl: "https://ms.yugipedia.com//thumb/e/ec/Truck_driver.png/257px-Truck_driver.png",
    videoUrl: "https://res.cloudinary.com/dotihphpy/video/upload/q_auto/v1765483092/Cluster_Truck_-_6_-_Blur_fxa2y3.mp4", 
    thumbnail: "https://res.cloudinary.com/dotihphpy/image/upload/q_auto/v1765483093/Cluster_Truck_-_Picture_-_6_-_Blur_ib7w0a.png",
    preniumGameplayLink: "https://premiumgameplay.com/explore?id=k31hs1g7-qsxj-7w41-ke3q-pa702t8p49" 
  },
    { 
    id: 31, 
    name: "Cluster Truck", 
    duration: "2 mins", 
    size: "225.45 MO", 
    author: "Daryl", 
    authorPicUrl: "https://ms.yugipedia.com//thumb/e/ec/Truck_driver.png/257px-Truck_driver.png",
    videoUrl: "https://res.cloudinary.com/dotihphpy/video/upload/q_auto/v1765483092/Cluster_Truck_-_7_-_Blur_ihpdnu.mp4", 
    thumbnail: "https://res.cloudinary.com/dotihphpy/image/upload/q_auto/v1765483091/Cluster_Truck_-_Picture_-_7_-_Blur_kwgryz.png",
    preniumGameplayLink: "https://premiumgameplay.com/explore?id=3dr3kyeb-b7oz-jo8v-y4n7-twzfslrc6xh" 
  },
    { 
    id: 32, 
    name: "Cluster Truck", 
    duration: "2 mins", 
    size: "226.11 MO", 
    author: "Daryl", 
    authorPicUrl: "https://ms.yugipedia.com//thumb/e/ec/Truck_driver.png/257px-Truck_driver.png",
    videoUrl: "https://res.cloudinary.com/dotihphpy/video/upload/q_auto/v1765483092/Cluster_Truck_-_8_-_Blur_xgpahg.mp4", 
    thumbnail: "https://res.cloudinary.com/dotihphpy/image/upload/q_auto/v1765483091/Cluster_Truck_-_Picture_-_8_-_Blur_oxmw9k.png",
    preniumGameplayLink: "https://premiumgameplay.com/explore?id=mk218ufr-bmu1-81hj-divs-ru4sywjfh87" 
  },
  // SLIME ------------------------------------------------------------------------------------------------------------------------------
{ 
    id: 33, 
    name: "Slime", 
    duration: "0m 53s", 
    size: "204.39 MO", 
    author: "Sir Satisfying", 
    authorPicUrl: "https://i.pinimg.com/736x/30/88/49/308849bbb361c64eb407cfb3be3aab4b.jpg",
    videoUrl: "https://res.cloudinary.com/dotihphpy/video/upload/q_auto/v1765483193/Slime_-_1_-_Blur_etybmv.mp4", 
    thumbnail: "https://res.cloudinary.com/dotihphpy/image/upload/q_auto/v1765483201/Slime_-_1_-_Picture_-_Blur_uvzgsw.png",
    preniumGameplayLink: "https://premiumgameplay.com/explore?id=0rbt0c54-ace8-8khb-nw6u-o6azecvjlzk" 
  },
  { 
    id: 34, 
    name: "Slime", 
    duration: "0m 56s", 
    size: "218.35 MO", 
    author: "Sir Satisfying", 
    authorPicUrl: "https://i.pinimg.com/736x/30/88/49/308849bbb361c64eb407cfb3be3aab4b.jpg",
    videoUrl: "https://res.cloudinary.com/dotihphpy/video/upload/q_auto/v1765483199/Slime_-_2_-_Blur_rbqmbi.mp4", 
    thumbnail: "https://res.cloudinary.com/dotihphpy/image/upload/q_auto/v1765483200/Slime_-_2_-_Picture_-_Blur_a73q74.png",
    preniumGameplayLink: "https://premiumgameplay.com/explore?id=c323vf97-p55v-upko-h5yl-0htqzh3sfnp" 
  },
  { 
    id: 35, 
    name: "Soap", 
    duration: "1m 6s", 
    size: "106.55 MO", 
    author: "Sir Satisfying", 
    authorPicUrl: "https://i.pinimg.com/736x/30/88/49/308849bbb361c64eb407cfb3be3aab4b.jpg",
    videoUrl: "https://res.cloudinary.com/dotihphpy/video/upload/q_auto/v1765483196/Slime_-_3_-_Blur_zfersl.mp4", 
    thumbnail: "https://res.cloudinary.com/dotihphpy/image/upload/q_auto/v1765483197/Slime_-_3_-_Picture_-_Blur_mxpomv.png",
    preniumGameplayLink: "https://premiumgameplay.com/explore?id=k71r7g2q-b0mk-wnoi-6fpy-oivcefyqnd" 
  },
  { 
    id: 36, 
    name: "Soap", 
    duration: "1m 20s", 
    size: "127.98 MO", 
    author: "Sir Satisfying", 
    authorPicUrl: "https://i.pinimg.com/736x/30/88/49/308849bbb361c64eb407cfb3be3aab4b.jpg",
    videoUrl: "https://res.cloudinary.com/dotihphpy/video/upload/q_auto/v1765483194/Slime_-_4_-_Blur_fay7v5.mp4", 
    thumbnail: "https://res.cloudinary.com/dotihphpy/image/upload/q_auto/v1765483195/Slime_-_4_-_Picture_-_Blur_u0conc.png",
    preniumGameplayLink: "https://premiumgameplay.com/explore?id=qe45nkaw-kfeb-qzcx-quz0-xvmijr80db" 
  },
  // TRACK_MANIA ------------------------------------------------------------------------------------------------------------------------------
  { 
    id: 37, 
    name: "Track Mania", 
    duration: "1 min", 
    size: "638.55 MO", 
    author: "Stacy", 
    authorPicUrl: "https://i.pinimg.com/originals/b2/d7/c3/b2d7c3afc8a01a3dabff4fd6401c48ae.jpg",
    videoUrl: "https://res.cloudinary.com/dotihphpy/video/upload/q_auto/v1765483280/TRACK_MANIA_-_1_-_Blur_jzspls.mp4", 
    thumbnail: "https://res.cloudinary.com/dotihphpy/image/upload/q_auto/v1765483281/TRACK_MANIA_-_Picture_-_1_-_Blur_jxct5y.png",
    preniumGameplayLink: "https://premiumgameplay.com/explore?id=9vygxbw3-ksjt-nt5t-4p86-ozdt3ky2dz" 
  },
    { 
    id: 38, 
    name: "Track Mania", 
    duration: "1 min", 
    size: "568.43 MO", 
    author: "Stacy", 
    authorPicUrl: "https://i.pinimg.com/originals/b2/d7/c3/b2d7c3afc8a01a3dabff4fd6401c48ae.jpg",
    videoUrl: "https://res.cloudinary.com/dotihphpy/video/upload/q_auto/v1765483277/TRACK_MANIA_-_2_-_Blur_e0phel.mp4", 
    thumbnail: "https://res.cloudinary.com/dotihphpy/image/upload/q_auto/v1765483278/TRACK_MANIA_-_Picture_-_2_-_Blur_ot3m6b.png",
    preniumGameplayLink: "https://premiumgameplay.com/explore?id=l2xxb8l3-ginv-2qv6-n4uw-pivljuxzv0h" 
  },
    { 
    id: 39, 
    name: "Track Mania", 
    duration: "1 min", 
    size: "358.30 MO", 
    author: "Stacy", 
    authorPicUrl: "https://i.pinimg.com/originals/b2/d7/c3/b2d7c3afc8a01a3dabff4fd6401c48ae.jpg",
    videoUrl: "https://res.cloudinary.com/dotihphpy/video/upload/q_auto/v1765483274/TRACK_MANIA_-_3_-_Blur_ig7uzz.mp4", 
    thumbnail: "https://res.cloudinary.com/dotihphpy/image/upload/q_auto/v1765483276/TRACK_MANIA_-_Picture_-_3_-_Blur_ctx8yl.png",
    preniumGameplayLink: "https://premiumgameplay.com/explore?id=c26y9cdj-bc88-0fq9-g08t-lhdvnujnj5" 
  },
    { 
    id: 40, 
    name: "Track Mania", 
    duration: "1 min", 
    size: "355.08 MO", 
    author: "Stacy", 
    authorPicUrl: "https://i.pinimg.com/originals/b2/d7/c3/b2d7c3afc8a01a3dabff4fd6401c48ae.jpg",
    videoUrl: "https://res.cloudinary.com/dotihphpy/video/upload/q_auto/v1765483271/TRACK_MANIA_-_4_-_Blur_bobohh.mp4", 
    thumbnail: "https://res.cloudinary.com/dotihphpy/image/upload/q_auto/v1765483272/TRACK_MANIA_-_Picture_-_4_-_Blur_zm5e6n.png",
    preniumGameplayLink: "https://premiumgameplay.com/explore?id=vnuli4zn-arqp-w61v-sv8f-kkfwgywxro" 
  },
];

// Mock Data for Subtitle Templates
// Mock Data for Subtitle Templates
const subtitleTemplates = [
  { id: 1, name: "No Animation", previewImage: "https://res.cloudinary.com/dotihphpy/image/upload/v1765569875/no-animation_k3snen.svg", type: "line" },
  { id: 2, name: "Karaoke", previewImage: "https://res.cloudinary.com/dotihphpy/image/upload/q_auto/v1765569875/karaoke_n0kuqp.svg", type: "line" },
  { id: 3, name: "Playful", previewImage: "https://res.cloudinary.com/dotihphpy/image/upload/v1765569877/playful_s5spgh.svg", type: "line" },
  { id: 4, name: "Highlighted", previewImage: "https://res.cloudinary.com/dotihphpy/image/upload/v1765569830/highlighted_f0xlrx.svg", type: "line" },
  { id: 5, name: "Block", previewImage: "https://res.cloudinary.com/dotihphpy/image/upload/v1765569829/block_xsvap1.svg", type: "line" },
  { id: 6, name: "Compact Word", previewImage: "https://res.cloudinary.com/dotihphpy/image/upload/v1765569829/compact-word_dwgqwf.svg", type: "word" },
];

export default function SplitScreenPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [file, setFile] = useState(null);
  const [youtubeLink, setYoutubeLink] = useState("");
  const [selectedBackground, setSelectedBackground] = useState(null);

  const [selectedSubtitle, setSelectedSubtitle] = useState(null);
  const [subtitleMode, setSubtitleMode] = useState("word"); // "word" or "line"
  const [linkError, setLinkError] = useState(""); // State for link validation error

  // Drag & Drop Handler
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles?.length > 0) {
      setFile(acceptedFiles[0]);
      toast.success("Fichier ajouté !");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'video/*': ['.mp4', '.mov', '.avi', '.webm'] },
    maxFiles: 1,
    multiple: false
  });

  // Steps Navigation
  const nextStep = () => {
    if (currentStep === 1 && !file && !youtubeLink) {
      toast.error("Veuillez mettre en ligne une vidéo ou entrer un lien.");
      return;
    }
    if (currentStep === 2 && !selectedBackground) {
      toast.error("Veuillez sélectionner un fond.");
      return;
    }
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const goToStep = (step) => {
      // Allow going back, but only go forward if previous steps completion logic is met (simplified here)
      if(step < currentStep) setCurrentStep(step);
  }

  const handleLinkSubmit = () => {
      if (!youtubeLink) {
         setLinkError("Veuillez entrer un lien.");
         return;
      }

      const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
      const tiktokRegex = /^(https?:\/\/)?(www\.)?(tiktok\.com)\/.+$/;

      if (!youtubeRegex.test(youtubeLink) && !tiktokRegex.test(youtubeLink)) {
          setLinkError("Ce lien ne semble pas être un lien YouTube ou TikTok valide.");
          return;
      }

      // Valid link: Clear file to ensure we use the link, proceeding to next step
      setLinkError("");
      setFile(null);
      nextStep();
  };

  const handleGenerate = () => {
      if (!selectedBackground || !selectedSubtitle || (!file && !youtubeLink)) {
          toast.error("Veuillez remplir toutes les informations avant de générer.");
          return;
      }

      const generationData = {
          gameplayId: selectedBackground.id,
          subtitleId: selectedSubtitle.id,
          file: file || null,
          youtubeLink: !file ? youtubeLink : null,
      };

      console.log("Generation Data:", generationData);
      toast.success("Génération lancée ! Vérifiez la console.");
  };

  return (
    <div className="h-screen bg-gray-50 p-3 font-sans text-gray-900 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white rounded-lg border border-gray-200">
             <Layout className="w-6 h-6 text-gray-700" />
          </div>
          <h1 className="text-xl font-bold">Vidéo Split Screen</h1>
        </div>
        <div className="flex gap-3">
           {/* If we needed a login button it would go here, mimicking the screenshot */}
        </div>
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div className="flex items-center space-x-4 text-sm font-medium">
          <button 
             onClick={() => goToStep(1)}
             className={`flex items-center gap-2 ${currentStep >= 1 ? "text-blue-600" : "text-gray-400"}`}
          >
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs border ${currentStep >= 1 ? "border-blue-600 bg-blue-50" : "border-gray-300"}`}>1</span>
            Mettre en ligne une vidéo
          </button>
          <ChevronRight className="w-4 h-4 text-gray-300" />
          
          <button 
             onClick={() => goToStep(2)}
             disabled={currentStep < 2}
             className={`flex items-center gap-2 ${currentStep >= 2 ? "text-blue-600" : "text-gray-400"}`}
          >
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs border ${currentStep >= 2 ? "border-blue-600 bg-blue-50" : "border-gray-300"}`}>2</span>
            Sélectionner un fond
          </button>
          <ChevronRight className="w-4 h-4 text-gray-300" />

          <button 
             onClick={() => goToStep(3)}
             disabled={currentStep < 3}
             className={`flex items-center gap-2 ${currentStep >= 3 ? "text-blue-600" : "text-gray-400"}`}
          >
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs border ${currentStep >= 3 ? "border-blue-600 bg-blue-50" : "border-gray-300"}`}>3</span>
            Sélectionner des sous-titres
          </button>
        </div>

        <button
          onClick={currentStep === 3 ? handleGenerate : nextStep}
          className="px-6 py-2 bg-blue-600 text-white cursor-pointer rounded-lg hover:bg-blue-700 transition font-medium flex items-center gap-2"
        >
          {currentStep === 3 ? "Générer" : "Suivant"}
          {currentStep !== 3 && <ChevronRight className="w-4 h-4" />}
        </button>
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex-1 overflow-hidden relative flex flex-col">
        <div className="absolute inset-0 overflow-y-auto p-7">
        {/* Step 1: Upload */}
        {currentStep === 1 && (
          <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto">
            <div className="w-full bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-gray-50 rounded-full">
                        <LinkIcon className="w-5 h-5 text-gray-500" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Mettez en ligne votre vidéo</h3>
                        <p className="text-gray-500 text-sm">Mettez en ligne une vidéo pour votre nouveau projet.</p>
                    </div>
                </div>
                
                <div className="p-8">
                    <div
                        {...getRootProps()}
                        className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-200 ${
                        isDragActive || file ? "border-blue-500 bg-blue-50/50" : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                    >
                        <input {...getInputProps()} />
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-500">
                                {file ? <FileVideo className="w-8 h-8"/> : <Cloud className="w-8 h-8" />}
                            </div>
                            
                            {file ? (
                                <div>
                                    <p className="text-gray-900 font-medium">{file.name}</p>
                                    <p className="text-gray-500 text-sm">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                                    <p className="text-blue-600 text-sm mt-2 font-medium">Cliquez pour remplacer</p>
                                </div>
                            ) : (
                                <div>
                                    <p className="text-gray-900 font-medium text-lg">Choisissez un clip ou glissez-déposez ici.</p>
                                    <p className="text-gray-500 mt-1">Formats MP4, jusqu'à 50 Mo.</p>
                                    <span className="inline-block mt-4 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium">Parcourir les fichiers</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-4 my-8">
                        <div className="h-px bg-gray-200 flex-1"></div>
                        <span className="text-gray-400 text-sm uppercase font-medium">OU</span>
                        <div className="h-px bg-gray-200 flex-1"></div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Ajouter un lien Youtube ou Tiktok</label>
                        <div className="flex gap-2">
                            <input 
                                type="text" 
                                placeholder="https://youtube.com/watch?v=..." 
                                className={`flex-1 px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all text-gray-900 placeholder:text-gray-400 ${
                                    linkError 
                                    ? "border-red-300 focus:ring-red-200 focus:border-red-500" 
                                    : "border-gray-300 focus:ring-blue-500/20 focus:border-blue-500"
                                }`}
                                value={youtubeLink}
                                onChange={(e) => {
                                    setYoutubeLink(e.target.value);
                                    if(linkError) setLinkError("");
                                }}
                                onKeyDown={(e) => e.key === 'Enter' && handleLinkSubmit()} // Allow Enter key
                            />
                            <button 
                                onClick={handleLinkSubmit}
                                className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition cursor-pointer"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                        {linkError && (
                            <p className="text-red-500 text-xs mt-1">{linkError}</p>
                        )}
                    </div>
                </div>
            </div>
          </div>
        )}


        {/* Step 2: Background Selection */}
        {currentStep === 2 && (
          <div className="h-full">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Sélectionner une vidéo de fond</h2>
            <p className="text-gray-500 mb-6">Astuce : Vous pourrez remplacer la vidéo de fond après la génération dans l'éditeur.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pb-4">
              {backgroundVideos.map((video) => (
                <VideoThumbnail 
                  key={video.id} 
                  video={video} 
                  isSelected={selectedBackground?.id === video.id}
                  onSelect={setSelectedBackground}
                />
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Subtitle Selection */}
        {currentStep === 3 && (
          <div className="h-full">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Sélectionner un modèle de sous-titres</h2>
                <div 
                  className="flex items-center bg-gray-100 p-1 rounded-lg cursor-pointer"
                  onClick={() => setSubtitleMode(mode => mode === "word" ? "line" : "word")}
                >
                    <span className={`px-3 py-1 text-sm font-medium transition-colors ${subtitleMode === "word" ? "text-gray-900 bg-white shadow-sm rounded" : "text-gray-600"}`}>Un mot</span>
                        <div className={`w-8 h-4 mx-2 rounded-full relative transition-colors ${subtitleMode === "line" ? "bg-blue-600" : "bg-gray-300"}`}>
                            <div className={`absolute top-1 w-2 h-2 bg-white rounded-full transition-all ${subtitleMode === "line" ? "right-1" : "left-1"}`}></div>
                        </div>
                    <span className={`px-3 py-1 text-sm font-medium transition-colors ${subtitleMode === "line" ? "text-gray-900 bg-white shadow-sm rounded" : "text-gray-600"}`}>Lignes</span>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pb-4">
              {subtitleTemplates.filter(t => t.type === subtitleMode).map((template) => (
                <div
                  key={template.id}
                  onClick={() => setSelectedSubtitle(template)}
                  className={`relative h-28 rounded-xl flex items-center justify-center cursor-pointer transition-all border-2 overflow-hidden bg-[#334155] ${
                    selectedSubtitle?.id === template.id
                      ? "border-blue-500 ring-2 ring-blue-500/20"
                      : "border-transparent hover:scale-105"
                  }`}
                >
                  {/* Image Preview with Fallback */}
                  <div className="w-full h-full flex items-center justify-center relative">
                     <Image
                        src={template.previewImage} 
                        alt={template.name}
                        className="w-full h-full max-w-2/3 mx-auto object-cover absolute inset-0" // Hidden by default, JS would handle opacity if I had a robust loaded state, but for now relying on styling. 
                        width={200}
                        height={200}
                     />
                     {/* Text Fallback (always rendered behind/if image fails) */}
                  </div>

                  {selectedSubtitle?.id === template.id && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center z-20">
                        <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}

// Subcomponent for Video Thumbnail with Play on Hover
function VideoThumbnail({ video, isSelected, onSelect }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleMouseEnter = () => {
    setIsPlaying(true);
    if (videoRef.current) {
      videoRef.current.play().catch(e => console.log("Play failed", e)); 
    }
  };

  const handleMouseLeave = () => {
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div
      className={`group rounded-xl overflow-hidden border-2 transition-all cursor-pointer bg-white ${
        isSelected ? "border-blue-500 ring-2 ring-blue-500/20" : "border-gray-200 hover:border-blue-300"
      }`}
      onClick={() => onSelect(video)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="aspect-video relative bg-gray-100">
        {/* Placeholder for video - in real app would use <video> */}
        {/* Using a simple div or img here, but simulating video behavior */}
        {/* If we have real URL we use video tag */}
        <video 
            ref={videoRef}
            src={video.videoUrl}
            className="w-full h-full object-cover"
            muted
            loop
            playsInline
            poster={video.thumbnail}
        />
        
        {/* Badge in top left if selected */}
        {isSelected && (
           <div className="absolute top-2 left-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white z-10 transition-transform transform scale-100">
             <Check className="w-4 h-4" />
           </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors pointer-events-none"></div>
      </div>
      
      <div className="p-3">
        <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-gray-900 truncate">{video.name}</h3>
            {/* Author avatar placeholder */}
            {/* put images here */} 
            <Image width={20} height={20} unoptimized src={video.authorPicUrl} alt={`${video.author} picture`} className="w-5 h-5 rounded-full" />
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>{video.duration}</span>
            <span>•</span>
            <span>{video.size}</span>
            <span className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-600">Gratuit</span>
        </div>
        
        <Link href={video.preniumGameplayLink ?? ""} target="_blank">
        <button className="w-full mt-3 py-2.5 px-2 text-xs font-medium text-gray-700 border border-gray-200 rounded hover:bg-gray-50 transition-colors">
            Voir sur Gameplay Premium
        </button>
        </Link>
      </div>
    </div>
  );
}
