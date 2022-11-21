import * as THREE from "three";

/**
 * this is a slot machine
 */
class SlotMachine{
    slotMachineRoles: (THREE.Object3D<THREE.Event> | undefined)[] = [];

    /**
     * animate the slot machine
     */
    update(delta: number){
        this.slotMachineRoles[0]?.rotateY( delta + Math.random() / 10) //delta +
        this.slotMachineRoles[1]?.rotateY( delta + Math.random() / 10)//delta +
        this.slotMachineRoles[2]?.rotateY( delta + Math.random() / 10)//delta +
    }
}

export {SlotMachine}
