import * as THREE from "three";
import { GUI, GUIController } from "dat.gui";

export type clip_plane = {

    /** THREE plane. */
    plane: THREE.Plane,

    /** Lower bound for clipping. */
    low: number,

    /** Upper bound for clipping. */
    high: number
}

export class MyGui extends GUI {

    /** Clipping plane in x. */
    plane_x: clip_plane;

    /** Clipping plane in y. */
    plane_y: clip_plane;

    /** Clipping plane in z. */
    plane_z: clip_plane;

    /** This is the folder that controls the clipping planes. */
    plane_controls: GUI;

    /** Controls the x clipping plane. */
    plane_slider_x: GUIController;

    /** Controls the y clipping plane. */
    plane_slider_y: GUIController;

    /** Controls the z clipping plane. */
    plane_slider_z: GUIController;

    /** This is the folder that controls other visuals. */
    visual_controls: GUI;

    /** Controls the transparency of the clipped city. */
    transparency_slider: GUIController;

    /** Objects to modify the transparency of with the slider. */
    transparent_objs: THREE.Group;

    /** Fog. */
    fog: THREE.FogExp2;

    /** Controls the density of the fog. */
    fog_density_slider: GUIController;

    constructor() {
        super(...arguments);

        this.plane_controls = this.addFolder("Plane controls");
        this.plane_controls.open();

        this.visual_controls = this.addFolder("Visual controls");
        this.visual_controls.open();
    }

    /** This method adds the clipping plane controls.
     * @param plane_x clip_plane Clipping plane in x.
     * @param plane_y clip_plane Clipping plane in y.
     * @param plane_z clip_plane Clipping plane in z.
     */
    add_plane_controls(plane_x: clip_plane, plane_y: clip_plane, plane_z: clip_plane) {
        this.plane_x = plane_x;
        this.plane_y = plane_y;
        this.plane_z = plane_z;
        this.plane_slider_x = this.plane_controls.add({ x: 1.0 }, "x", 0.0, 1.0);
        this.plane_slider_y = this.plane_controls.add({ y: 1.0 }, "y", 0.0, 1.0);
        this.plane_slider_z = this.plane_controls.add({ z: 1.0 }, "z", 0.0, 1.0);

        var func_x = this.update_plane_slider_x.bind(this); // Binding this to its method so we can pass it as a standalone function
        this.plane_slider_x.onChange(func_x);

        var func_y = this.update_plane_slider_y.bind(this); // Binding this to its method so we can pass it as a standalone function
        this.plane_slider_y.onChange(func_y);

        var func_z = this.update_plane_slider_z.bind(this); // Binding this to its method so we can pass it as a standalone function
        this.plane_slider_z.onChange(func_z);

    }

    add_transparency_control(objs: THREE.Group)
    {
        this.transparency_slider = this.visual_controls.add({transparency: 0.6}, "transparency", 0.0, 1.0);
        this.transparent_objs = objs;

        var func = this.update_transparency_slider.bind(this);
        this.transparency_slider.onChange(func);
    }

    add_fog_control(fog: THREE.FogExp2)
    {
        this.fog = fog;

        this.fog_density_slider = this.visual_controls.add({fog_density: this.fog.density}, "fog_density", 0.0, 0.01);
        this.fog_density_slider.onChange(this.update_fog_density_slider.bind(this));
    }

    /** Update the clipping plane_x constant.
     * @param slider_value {number} New clipping plane constant.
     */
    update_plane_slider_x(slider_value: number) {
        this.plane_x.plane.constant = this.plane_x.low + slider_value*(this.plane_x.high-this.plane_x.low);
    }

    /** Update the clipping plane_y constant.
     * @param slider_value {number} New clipping plane constant.
     */
    update_plane_slider_y(slider_value: number) {
        this.plane_y.plane.constant = this.plane_y.low + slider_value*(this.plane_y.high-this.plane_y.low);
    }

    /** Update the clipping plane_z constant.
     * @param slider_value {number} New clipping plane constant.
     */
    update_plane_slider_z(slider_value: number) {
        this.plane_z.plane.constant = this.plane_z.low + slider_value*(this.plane_z.high-this.plane_z.low);
    }

    update_transparency_slider(slider_value: number) {
        this.transparent_objs.traverse((o) => {       
            if ((o as THREE.Mesh).isMesh) {
                ((o as THREE.Mesh).material as THREE.Material).opacity = slider_value;
            }
        });
    }

    update_fog_density_slider(slider_value: number) {
        this.fog.density = slider_value;
    }
}
