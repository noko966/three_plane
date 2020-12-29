import * as THREE from "three";

import vertex from "./shaders/vertex.glsl";
import fragment from "./shaders/fragment.glsl";


// import {TimelineMax} from "gsap";
let OrbitControls = require("three-orbit-controls")(THREE);


export default class Sketch{
    constructor(selector){
        this.scene = new THREE.Scene();

        this.renderer = new THREE.WebGLRenderer();
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.width, this.height);
        this.renderer.setClearColor(0xeeeeee, 1);
        this.renderer.physicallyCorrectLights = true;
        this.renderer.outputEncoding = THREE.sRGBEncoding;

        this.container = document.getElementById(selector);
        
        this.container.appendChild(this.renderer.domElement);

        this.camera = new THREE.PerspectiveCamera(
            70,
            window.innerWidth / window.innerHeight,
            0.001,
            1000
        );

        this.camera.position.set(0, 0, 2);
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.time = 0;

        this.paused = false;

        this.setupResize();
        // this.tabEvents();

        this.addObjects();
        this.resize();
        this.render();
        // this.settings();


    }

    // settings(){
    //     let t = this;
    //     this.settings = {
    //         time: 0,
    //     };
    //     this.gui = new data.GUI();
    //     this.gui.add(this.settings, "time", 0, 100, 0.01);
    // }

    setupResize(){
        window.addEventListener("resize", this.resize.bind(this));
    }

    resize(){
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.renderer.setSize(this.width, this.height);
        this.camera.aspect = this.width / this.height;

        // this.imageAspect = 853 / 1280;
        // let a1;
        // let a2;
        // if(this.height / this.width > this.imageAspect){
        //     a1 = (this.width / this.height) * this.imageAspect;
        //     a2 = 1;
        // } else {
        //     a1 = 1;
        //     a2 = (this.width / this.height) * this.imageAspect;
        // }

        this.camera.updateProjectionMatrix();
    }

    addObjects(){
        this.material = new THREE.ShaderMaterial({
            side: THREE.DoubleSide,
            wireframe: false,
            uniforms: {
                time: { type: "f", value: 0},
                resolution: { type: "v4", value: new THREE.Vector4()},
                uvRate1: { 
                    value: new THREE.Vector2(1, 1)
                }
            },
            vertexShader: vertex,
            fragmentShader: fragment,

        });

        // this.material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );

        this.geometry = new THREE.PlaneBufferGeometry(1, 1);

        this.plane = new THREE.Mesh(this.geometry, this.material);
        this.scene.add(this.plane);
    }
    tabEvents(){
        let t = this;
        document.addEventListener("visibilitychange", function(){
            if(document.hidden){
                t.stop();
            }else{
                t.play();
            }
        });
    }

    stop(){
        this.paused = true;
    }
    play(){
        this.paused = false;
    }

    render(){
        if(this.paused) return;
        this.time += 0.05;
        this,this.material.uniforms.time.value = this.time;
        requestAnimationFrame(this.render.bind(this));
        this.renderer.render(this.scene, this.camera);
    }


}

var canvas = new Sketch("container");

console.log(canvas.scene);

