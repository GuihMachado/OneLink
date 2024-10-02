import {
  Component,
  Input,
  NgModule,
  booleanAttribute,
  setClassMetadata,
  ɵɵInputTransformsFeature,
  ɵɵStandaloneFeature,
  ɵɵattribute,
  ɵɵdefineComponent,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵhostProperty
} from "./chunk-3CGF6O5H.js";
import "./chunk-4J25ECOH.js";
import "./chunk-J4B6MK7R.js";

// node_modules/@spartan-ng/ui-separator-brain/fesm2022/spartan-ng-ui-separator-brain.mjs
var _BrnSeparatorComponent = class _BrnSeparatorComponent {
  constructor() {
    this._orientation = "horizontal";
    this._decorative = false;
  }
  set orientation(value) {
    this._orientation = value;
  }
  set decorative(value) {
    this._decorative = value;
  }
};
_BrnSeparatorComponent.ɵfac = function BrnSeparatorComponent_Factory(t) {
  return new (t || _BrnSeparatorComponent)();
};
_BrnSeparatorComponent.ɵcmp = ɵɵdefineComponent({
  type: _BrnSeparatorComponent,
  selectors: [["brn-separator"]],
  hostVars: 3,
  hostBindings: function BrnSeparatorComponent_HostBindings(rf, ctx) {
    if (rf & 2) {
      ɵɵhostProperty("role", ctx._decorative ? "none" : "separator");
      ɵɵattribute("aria-orientation", ctx._decorative ? void 0 : ctx._orientation === "vertical" ? "vertical" : void 0)("data-orientation", ctx._orientation);
    }
  },
  inputs: {
    orientation: "orientation",
    decorative: [2, "decorative", "decorative", booleanAttribute]
  },
  standalone: true,
  features: [ɵɵInputTransformsFeature, ɵɵStandaloneFeature],
  decls: 0,
  vars: 0,
  template: function BrnSeparatorComponent_Template(rf, ctx) {
  },
  encapsulation: 2
});
var BrnSeparatorComponent = _BrnSeparatorComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BrnSeparatorComponent, [{
    type: Component,
    args: [{
      selector: "brn-separator",
      standalone: true,
      template: "",
      host: {
        "[role]": '_decorative ? "none" : "separator"',
        "[attr.aria-orientation]": '_decorative ? undefined : _orientation === "vertical" ? "vertical" : undefined ',
        "[attr.data-orientation]": "_orientation"
      }
    }]
  }], null, {
    orientation: [{
      type: Input
    }],
    decorative: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }]
  });
})();
var _BrnSeparatorModule = class _BrnSeparatorModule {
};
_BrnSeparatorModule.ɵfac = function BrnSeparatorModule_Factory(t) {
  return new (t || _BrnSeparatorModule)();
};
_BrnSeparatorModule.ɵmod = ɵɵdefineNgModule({
  type: _BrnSeparatorModule,
  imports: [BrnSeparatorComponent],
  exports: [BrnSeparatorComponent]
});
_BrnSeparatorModule.ɵinj = ɵɵdefineInjector({});
var BrnSeparatorModule = _BrnSeparatorModule;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BrnSeparatorModule, [{
    type: NgModule,
    args: [{
      imports: [BrnSeparatorComponent],
      exports: [BrnSeparatorComponent]
    }]
  }], null, null);
})();
export {
  BrnSeparatorComponent,
  BrnSeparatorModule
};
//# sourceMappingURL=@spartan-ng_ui-separator-brain.js.map
