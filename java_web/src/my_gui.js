import * as THREE from "three";
import { GUI } from "dat.gui";
export class MyGui extends GUI {
    constructor() {
        super(...arguments);
    }

    /** This method adds the clipping plane controls.
     * @param plane_x {plane: THREE.Plane, low: Number, high: Number} Clipping plane in x.
     * @param plane_y {plane: THREE.Plane, low: Number, high: Number} Clipping plane in y.
     * @param plane_z {plane: THREE.Plane, low: Number, high: Number} Clipping plane in z.
     */
    addPlaneControls(plane_x, plane_y, plane_z) {
        this.plane_x = plane_x;
        this.plane_y = plane_y;
        this.plane_z = plane_z;
        this.plane_controls = this.addFolder("Plane controls");
        this.plane_slider_x = this.plane_controls.add({ x: 1.0 }, "x", 0.0, 1.0);
        this.plane_slider_y = this.plane_controls.add({ y: 1.0 }, "y", 0.0, 1.0);
        this.plane_slider_z = this.plane_controls.add({ z: 1.0 }, "z", 0.0, 1.0);

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
        this.plane_x.plane.constant = this.plane_x.low + slider_value*(this.plane_x.high-this.plane_x.low);
    }

    /** Update the clipping plane_y constant.
     * @param slider_value {Number} New clipping plane constant.
     */
    update_plane_slider_y(slider_value) {
        this.plane_y.plane.constant = this.plane_y.low + slider_value*(this.plane_y.high-this.plane_y.low);
    }

    /** Update the clipping plane_z constant.
     * @param slider_value {Number} New clipping plane constant.
     */
    update_plane_slider_z(slider_value) {
        this.plane_z.plane.constant = this.plane_z.low + slider_value*(this.plane_z.high-this.plane_z.low);
    }
}
