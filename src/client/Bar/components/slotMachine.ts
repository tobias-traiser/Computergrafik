import * as THREE from "three";

class SlotMachine{
    slotMachineRoles: (THREE.Object3D<THREE.Event> | undefined)[] = [];

    update(){
        this.slotMachineRoles[0]?.rotateY( Math.random() / 10) //delta +
        this.slotMachineRoles[1]?.rotateY( Math.random() / 10)//delta +
        this.slotMachineRoles[2]?.rotateY( Math.random() / 10)//delta +
    }
}

export {SlotMachine}
