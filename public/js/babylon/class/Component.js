import TYPE from "../const/componentType.js";
import LAYER from "../const/layer.js";
import STATUS from "../const/status.js";
import OPACITY from "../const/opacity.js";
import COMPONENT_TYPE from "../const/componentType.js";
import { singlePillar } from "../material/singlePillar.js";
import { terraceTile } from "../material/terraceTile.js";
import { width, height } from "../const/material.js";
import { stair } from "../material/stair.js";

/**
 * 単位コンポーネントクラス
 */
export default class Component {
    constructor(type, x, y, z) {
        this.mesh = this.clone(type, x, y, z);
        if (type === TYPE.SINGLE_PILLAR) {
            // 切替用 2段柱
            this.mesh2 = this.clone(TYPE.DOUBLE_PILLAR, x, y, z);
        }
        this.type = type;
        this.position = {x, y, z};
        this.status = STATUS.HIDDEN;
    }

    setHidden    = () => { this.setStatus(STATUS.HIDDEN); }
    setPreview   = () => { this.setStatus(STATUS.PREVIEW); }
    setHover     = () => { this.setStatus(STATUS.HOVER); }
    setSelected  = () => { this.setStatus(STATUS.SELECTED); }
    setConfirmed = () => { this.setStatus(STATUS.CONFIRMED); }
    setStatus = (status) => {
        this.status = status;
        if (this.mesh.material) {
            setObjectStatus(this.mesh, status);
        } else { // Group
            this.mesh.traverse((child) => {
                if (child.isMesh) {
                    this.setObjectStatus(child, status);
                }
            });
        }
    }
    setObjectStatus = (source, status) => {
        source.material.transparent = true
        if (source.userData.isHitBox) {
            source.material.opacity = OPACITY_HIT_BOX[status]
        } else {
            source.material.opacity = OPACITY[status]
        }
        switch (status) {
            case STATUS.CONFIRMED: source.layers.set(LAYER.CONFIRMED); break;
            case STATUS.SELECTED : source.layers.set(LAYER.PREVIEW); break;
            case STATUS.HOVER    : source.layers.set(LAYER.PREVIEW); break;
            case STATUS.PREVIEW  : source.layers.set(LAYER.PREVIEW); break;
            default: source.layers.set(LAYER.HIDDEN);
        }
    }
    clone = (component, x, y, z) => {
        let clonedObject = null;
        switch (component) {
            case COMPONENT_TYPE.SINGLE_PILLAR: clonedObject = singlePillar.clone(); break;
            case COMPONENT_TYPE.TERRACE_TILE: clonedObject = terraceTile.clone(); break;
            case COMPONENT_TYPE.STAIR: clonedObject = stair.clone(); break;
            default: return null;
        }
        if (!clonedObject.material) {
            clonedObject.traverse((child) => {
                if (child.isMesh) {
                    child.material = child.material.clone();
                }
            });
        }
        // clonedObject.layers.set(LAYER.HIDDEN);
        clonedObject.layers.set(LAYER.CONFIRMED);
        clonedObject.name = `${component}#${x},${y},${z}`;
        clonedObject.userData.layer = LAYER.HIDDEN;
        const pos = this.convertPosition(x, y, z)
        clonedObject.position.x = pos.x;
        clonedObject.position.y = pos.y;
        clonedObject.position.z = pos.z;
        return clonedObject;
    }
    convertPosition = (x, y, z) => ({ x: width * (x - 3.5), y: height * y + 1, z: width * (z - 3.5) });
}