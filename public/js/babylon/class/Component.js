import TYPE from "../const/componentType.js";
import STATUS from "../const/status.js";
import OPACITY from "../const/opacity.js";
import { clone } from "../../babylon_bk/material.js";

/**
 * 単位コンポーネントクラス
 */
export default class Component {
    constructor({type, x, y, z}) {
        this.mesh = clone(type, x, y, z);
        if (type === TYPE.SINGLE_PILLAR) {
            // 切替用 2段柱
            this.mesh2 = clone(TYPE.DOUBLE_PILLAR, x, y, z);
        }
        this.type = type;
        this.position = {x, y, z};
        this.status = STATUS.HIDDEN;
    }

    setHidden    = () => { setStatus(STATUS.HIDDEN); }
    setPreview   = () => { setStatus(STATUS.PREVIEW); }
    setHover     = () => { setStatus(STATUS.HOVER); }
    setSelected  = () => { setStatus(STATUS.SELECTED); }
    setConfirmed = () => { setStatus(STATUS.CONFIRMED); }
    setStatus = (status) => {
        this.status = status;
        if (this.mesh.material) {
            setObjectStatus(this.mesh, status);
        } else { // Group
            this.mesh.traverse((child) => {
                if (child.isMesh) {
                    setObjectStatus(child, status);
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
}