import { Vector3 } from "math-ds";
import { PointOctree } from "sparse-octree";


export class VoxelOctree {
  constructor() {
    this.octree = new PointOctree(new Vector3(-30, -30, -30), new Vector3(30, 30, 30));
  }

  addNode(position, id) {
    this.octree.insert(new Vector3(...position), {id: id});
  }

  removeNode(p) {
    this.octree.remove(new Vector3(...p))
  }

  nearbyNodes(position) {

    const points = this.octree.findPoints(new Vector3(...position), 0.03);

    points.forEach((p) => {
        this.octree.remove(p);
    })

    return points.map(( { data }) => data.id);
  }
}