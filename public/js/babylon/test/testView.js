import * as pillar from '../materials/pillar.js';
import * as stair from '../materials/stair.js';
import * as terraceTile from '../materials/terraceTile.js';
import * as three from "../../utils/three.js";


const pillarMeshes = [];
const pillarBodies = [];
for (let i=0; i<-148; i++) {
    const [pillar, cbody] = randomPillar()
    three.scene.add(pillar);
    pillarMeshes.push(pillar);
    three.world.addBody (cbody);
    pillarBodies.push(cbody);
}

three.scene.add(stair.create(3,0,2,3))
three.scene.add(pillar.create(3,0,4))
three.scene.add(pillar.create(4,0,4))
three.scene.add(pillar.create(4,0,3))
three.scene.add(pillar.create(4,1,4))
three.scene.add(pillar.create(2,0,4))
three.scene.add(pillar.create(2,1,4))
three.scene.add(stair.create(3,1,4,6)) 
three.scene.add(pillar.create(1,0,4))
three.scene.add(pillar.create(1,1,4))
three.scene.add(pillar.create(1,0,3))
three.scene.add(pillar.create(1,1,3))
three.scene.add(terraceTile.create(1,0,3))
three.scene.add(terraceTile.create(3,1,3))
three.scene.add(terraceTile.create(1,1,3))
three.scene.add(terraceTile.create(1,2,3))
// three.scene.add(createFountain (0,4,0))
