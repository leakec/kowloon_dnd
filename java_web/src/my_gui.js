import * as THREE from "three";
import { GUI } from "dat.gui";
export class MyGui extends GUI {
    constructor() {
        super(...arguments);
    }

    /** This method adds the clipping plane controls.
     * @param plane_x {THREE.Plane} Clipping plane in x.
     * @param plane_y {THREE.Plane} Clipping plane in y.
     * @param plane_z {THREE.Plane} Clipping plane in z.
     */
    addPlaneControls(plane_x, plane_y, plane_z) {
        this.plane_x = plane_x;
        this.plane_y = plane_y;
        this.plane_z = plane_z;
        this.plane_controls = this.addFolder("Plane controls");
        this.plane_slider_x = this.plane_controls.add({ x: 256.98 }, "x", -6.79, 256.98);
        this.plane_slider_y = this.plane_controls.add({ y: 52.54 }, "y", 2.85, 52.54);
        this.plane_slider_z = this.plane_controls.add({ z: 176.66 }, "z", -10.71, 176.66);

        var func_x = this.update_plane_slider_x.bind(this); // Binding this to its method so we can pass it as a standalone function
        this.plane_slider_x.onChange(func_x);

        var func_y = this.update_plane_slider_y.bind(this); // Binding this to its method so we can pass it as a standalone function
        this.plane_slider_y.onChange(func_y);

        var func_z = this.update_plane_slider_z.bind(this); // Binding this to its method so we can pass it as a standalone function
        this.plane_slider_z.onChange(func_z);

        this.plane_controls.open();
    }

    /** Update the clipping plane_x constant.
     * @param slider_value {Number} New clipping plane constant.
     */
    update_plane_slider_x(slider_value) {
        this.plane_x.constant = slider_value;
    }

    /** Update the clipping plane_y constant.
     * @param slider_value {Number} New clipping plane constant.
     */
    update_plane_slider_y(slider_value) {
        this.plane_y.constant = slider_value;
    }

    /** Update the clipping plane_z constant.
     * @param slider_value {Number} New clipping plane constant.
     */
    update_plane_slider_z(slider_value) {
        this.plane_z.constant = slider_value;
    }
}
