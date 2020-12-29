import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import vertex from "./shaders/vertex.glsl";
import fragment from "./shaders/fragment.glsl";
import skullModel from "./model/skull.obj";
import matcap from "./img/mat.jpg";


import gsap from "gsap";
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
        // this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.time = 0;
        this.paused = false;

        

        this.setupResize();
        this.tabEvents();
        this.addObjects();
        this.resize();
        this.render();
        
        // this.settings();


        this.loader = new OBJLoader();
        this.loader.load(
            skullModel,
            (object) => {
                this.skullJaw = object.children[0];
                this.skullTeethUpper = object.children[1];
                this.skullTeethLower = object.children[2];
                this.skullhead = object.children[3];

                this.skull = object;
                // this.skullJaw.material = this.material;
                // this.skullTeethUpper.material = this.material;
                // this.skullTeethLower.material = this.material;
                // this.skullhead.material = this.material;

                object.children.forEach(c => {
                    // c.material = new THREE.MeshMatcapMaterial({
                    //     matcap: new THREE.TextureLoader().load(matcap)
                    // });
                    c.material = this.material;
                })
                


                object.scale.set(0.05,0.05,0.05);
                object.position.y = -0.5;
                object.rotation.x = -Math.PI / 2;

                this.scene.add(this.skull);
            },
            // function(xhr){
            //     console.log((xhr.loaded / xhr/total * 100) + '% loaded');
            // },
            // function(error){
            //     console.log('error happened obj not loaded ' + error);
            // }
        );

        this.mouse();


    }

    mouse(){
        document.body.addEventListener('mousemove', (e) => {
            let mx = (e.clientX / window.innerWidth) * 2 - 1;
            let my = -(e.clientY / window.innerHeight) * 2 - 1;

            console.log(my);
            gsap.to(this.skull.rotation, {
                duration: 1,
                z: mx,
                x: my,
            })
        });
        document.body.addEventListener('mousedown', (e) => {
            gsap.to(this.skullJaw.rotation, {
                duration: 0.5,
                x: Math.PI / 16
            })
            gsap.to(this.skullTeethLower.rotation, {
                duration: 0.5,
                x: Math.PI / 16
            })
        });
        document.body.addEventListener('mouseup', (e) => {
            let mx = e.clientX / window.innerWidth;
            gsap.to(this.skullJaw.rotation, {
                duration: 0.5,
                x: 0
            })
            gsap.to(this.skullTeethLower.rotation, {
                duration: 0.5,
                x: 0
            })
        });
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
                matcap: { type: "t", value: new THREE.TextureLoader().load(matcap)},
                uvRate1: { 
                    value: new THREE.Vector2(1, 1)
                }
            },
            vertexShader: vertex,
            fragmentShader: fragment,

        });


        this.geometry = new THREE.PlaneBufferGeometry(1, 1);

        this.plane = new THREE.Mesh(this.geometry, this.material);
        // this.scene.add(this.plane);
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

