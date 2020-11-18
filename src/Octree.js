import { Vector3 } from "math-ds";
import { PointOctree } from "sparse-octree";

export class VoxelOctree {
  constructor() {
    this.octree = new PointOctree(
      new Vector3(-30, -30, -30),
      new Vector3(30, 30, 30)
    );
  }

  addNode({ position, id, color, size }) {
    this.octree.insert(new Vector3(...position), { id, color, size });
    return this.voxels();
  }

  removeNode(p) {
    this.octree.remove(new Vector3(...p));
  }

  voxels() {
    const leaves = [...this.octree.leaves()];
    return leaves
      .filter((p) => p.points !== null)
      .map(({ points, data }) => {
        return points.map((point, idx) => {
          return { position: point, ...data[idx] };
        });
      })
      .flat();
  }

  removeNearbyNodes(position) {
    const points = this.octree.findPoints(new Vector3(...position), 0.03);

    points.forEach((p) => {
      this.octree.remove(p.point);
    });

    return this.voxels();
  }
}
