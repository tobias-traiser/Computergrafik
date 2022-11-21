import * as THREE from "three";

/**
 * this is a slot machine
 */
class SlotMachine{
    slotMachineRoles: (THREE.Object3D<THREE.Event> | undefined)[] = [];
    slotMachineHandle: THREE.Object3D<THREE.Event>| undefined;

    /**
     * Animate the slot machine
     */
    update(delta: number){
        this.slotMachineRoles[0]?.rotateY( delta + Math.random() / 10) //delta +
        this.slotMachineRoles[1]?.rotateY( delta + Math.random() / 10)//delta +
        this.slotMachineRoles[2]?.rotateY( delta + Math.random() / 10)//delta +
    }

    /**
     * Set interaction text
     */
    setText() {
        let div = document.getElementById("point")!;
        div.innerHTML = "press E to play";
    }

}

export {SlotMachine}
