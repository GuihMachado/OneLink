import {
  HttpErrorResponse
} from "./chunk-MIK43VZL.js";
import "./chunk-62KCDTIT.js";
import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  NgModule,
  Renderer2,
  setClassMetadata,
  ɵɵdefineDirective,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵdirectiveInject,
  ɵɵlistener
} from "./chunk-3CGF6O5H.js";
import {
  BehaviorSubject,
  Subject,
  Subscription,
  catchError,
  combineLatest,
  map,
  of,
  switchMap,
  tap
} from "./chunk-4J25ECOH.js";
import "./chunk-J4B6MK7R.js";

// node_modules/@linkway/utilities/fesm2022/linkway-utilities-command.mjs
var QueryStringEventKind;
(function(QueryStringEventKind2) {
  QueryStringEventKind2["Same"] = "Same";
  QueryStringEventKind2["Inserted"] = "Inserted";
  QueryStringEventKind2["Updated"] = "Updated";
  QueryStringEventKind2["Removed"] = "Removed";
})(QueryStringEventKind || (QueryStringEventKind = {}));
var QueryString = class {
  constructor() {
    this._changes = new Subject();
    this._changes$ = this._changes.asObservable();
    this._params = {};
    this.tempCache = {};
  }
  get changes$() {
    return this._changes$;
  }
  set value(value) {
    if (value) {
      let temp = {};
      value.split("&").forEach((x) => {
        let firstEqual = x.indexOf("=");
        let param = x.substring(0, firstEqual);
        let value2 = x.substring(firstEqual + 1);
        if (param) {
          temp[param] = value2;
        }
      });
      Object.keys(this._params).forEach((x) => {
        this.param(x, temp[x]);
        delete temp[x];
      });
      Object.keys(temp).forEach((x) => {
        this.param(x, temp[x]);
      });
    } else {
      Object.keys(this._params).forEach((x) => {
        this.param(x, void 0);
      });
    }
  }
  param(property, value, emitChanges) {
    if (!emitChanges) {
      emitChanges = true;
    }
    if (!this._params.hasOwnProperty(property)) {
      this._params[property] = this.defaultParameter(property);
    }
    let parameter = this._params[property];
    let isSame = value === value;
    let isRemove = value === void 0;
    let isInsert = parameter.value === void 0 && value !== void 0;
    let isUpdate = parameter.value !== void 0 && value !== void 0 && parameter.value + "" !== value + "";
    parameter.value = value;
    if (emitChanges && parameter.config.insert && isInsert) {
      this._changes.next({
        parameter,
        event: QueryStringEventKind.Inserted
      });
    }
    if (emitChanges && parameter.config.update && isUpdate) {
      this._changes.next({
        parameter,
        event: QueryStringEventKind.Updated
      });
    }
    if (emitChanges && parameter.config.remove && isRemove) {
      this._changes.next({
        parameter,
        event: QueryStringEventKind.Removed
      });
    }
    if (emitChanges && parameter.config.same && isSame) {
      this._changes.next({
        parameter,
        event: QueryStringEventKind.Same
      });
    }
  }
  removeParam(property, emitChanges) {
    this.param(property, void 0, emitChanges);
  }
  getParamValue(property) {
    if (this._params.hasOwnProperty(property)) {
      return this._params[property];
    }
    return void 0;
  }
  build() {
    return Object.keys(this._params).map((x) => {
      if (this._params[x].value) {
        return `${x}=${this._params[x].value}`;
      }
      return void 0;
    }).filter((x) => x !== void 0).join("&");
  }
  watch(property, config = {
    insert: true,
    update: true,
    remove: true,
    same: false
  }, value) {
    if (!this._params.hasOwnProperty(property)) {
      this._params[property] = {
        key: property,
        value,
        config
      };
    } else {
      this._params[property].config = config;
    }
    return this;
  }
  ignore(property) {
    if (this._params.hasOwnProperty(property)) {
      this._params[property].config = this.defaultParameter(property).config;
    }
    return this;
  }
  defaultParameter(key) {
    return {
      key,
      value: void 0,
      config: {
        insert: false,
        update: false,
        remove: false,
        same: false
      }
    };
  }
};
var RestState = class {
  constructor() {
    this.queryString = new QueryString();
    this.buildBody = () => {
      return {};
    };
  }
};
var RestResponseStatus;
(function(RestResponseStatus2) {
  RestResponseStatus2["NONE"] = "NONE";
  RestResponseStatus2["GOOD"] = "GOOD";
  RestResponseStatus2["BAD"] = "BAD";
})(RestResponseStatus || (RestResponseStatus = {}));
var RestResponse = class {
  constructor(status = RestResponseStatus.NONE, result, error) {
    this.status = status;
    this.result = result;
    this.error = error;
  }
  get isSuccess() {
    return this.status === RestResponseStatus.GOOD;
  }
};
var ErrorType;
(function(ErrorType2) {
  ErrorType2["Any"] = "Any";
  ErrorType2["Http"] = "Http";
  ErrorType2["NoConnection"] = "NoConnection";
})(ErrorType || (ErrorType = {}));
var RestError = class {
  constructor(type, response, body) {
    this.type = type;
    this.response = response;
    this.body = body;
  }
};
var BaseRestCommand = class {
  get response() {
    return this.__response;
  }
  get response$() {
    return this._response$;
  }
  get isExecuting() {
    return this.__isExecuting;
  }
  get wasExecuted() {
    return this.__wasExecuted;
  }
  get canExecute() {
    return this.__canExecute;
  }
  get isExecuting$() {
    return this._isExecuting$;
  }
  get canExecute$() {
    return this._canExecute$;
  }
  get wasExecuted$() {
    return this._wasExecuted$;
  }
  get neverExecuted$() {
    return this._neverExecuted$;
  }
  get firstLoad$() {
    return this._firstLoad$;
  }
  get laterLoad$() {
    return this._laterLoad$;
  }
  get isReady$() {
    return this._isReady$;
  }
  get hasError$() {
    return this._hasError$;
  }
  constructor(executionObservable, canExecuteObservable) {
    this.executionObservable = executionObservable;
    this.canExecuteObservable = canExecuteObservable;
    this.__response = new RestResponse();
    this.__canExecute = false;
    this.__isExecuting = false;
    this.__wasExecuted = false;
    this._isExecuting = new BehaviorSubject(false);
    this._wasExecuted = new BehaviorSubject(false);
    this._neverExecuted = new BehaviorSubject(true);
    this._firstLoad = new BehaviorSubject(false);
    this._laterLoad = new BehaviorSubject(false);
    this._isReady = new BehaviorSubject(false);
    this._hasError = new BehaviorSubject(false);
    this.executionPipe$ = new Subject();
    this._isExecuting$ = this._isExecuting.asObservable();
    this._wasExecuted$ = this._wasExecuted.asObservable();
    this._neverExecuted$ = this._neverExecuted.asObservable();
    this._firstLoad$ = this._firstLoad.asObservable();
    this._laterLoad$ = this._laterLoad.asObservable();
    this._isReady$ = this._isReady.asObservable();
    this._hasError$ = this._hasError.asObservable();
    this.executionPipeSubcription = Subscription.EMPTY;
    this.canExecuteSubcription = Subscription.EMPTY;
    this.isExecutingSubcription = Subscription.EMPTY;
    this.self = this;
    this.initialize();
  }
  execute() {
    this.subscribeIfNeed();
    this.executionPipe$.next({});
  }
  repeat() {
    this.subscribeIfNeed();
    this._wasExecuted.next(this.__wasExecuted);
    this._isExecuting.next(this.__isExecuting);
    this._response.next(this.__response);
  }
  destroy() {
    if (this.executionPipeSubcription) {
      this.executionPipeSubcription.unsubscribe();
    }
    if (this.canExecuteSubcription) {
      this.canExecuteSubcription.unsubscribe();
    }
    if (this.isExecutingSubcription) {
      this.isExecutingSubcription.unsubscribe();
    }
    if (this.changes$) {
      this.changes$.unsubscribe();
    }
  }
  reset() {
    if (!this.__wasExecuted) {
      return;
    }
    this.__wasExecuted = false;
    this._wasExecuted.next(this.__wasExecuted);
    this.__response = new RestResponse();
    this._response.next(this.__response);
    this.__isExecuting = false;
    this._isExecuting.next(this.__isExecuting);
    this._isReady.next(false);
    this._hasError.next(false);
  }
  executeOnChange(params = []) {
    if (this.changes$) {
      this.changes$.unsubscribe();
    }
    params.forEach((x) => this.state.queryString.watch(x));
    this.changes$ = this.state.queryString.changes$.subscribe((x) => {
      if (params.length === 0 || params.indexOf(x.parameter.key) != -1) {
        this.execute();
      }
    });
  }
  stopExecuteOnChanges() {
    if (this.changes$) {
      this.changes$.unsubscribe();
    }
  }
  buildExecutionPipe() {
    return this.executionPipe$.pipe(tap(() => {
      this.__isExecuting = true;
      this._isExecuting.next(this.__isExecuting);
      if (!this.__wasExecuted) {
        this._firstLoad.next(true);
      } else {
        this._laterLoad.next(true);
      }
    }), switchMap(() => {
      return this.executionObservable(this.self).pipe(catchError((error) => {
        if (error instanceof HttpErrorResponse) {
          let restError = new RestError(error.status > 0 ? ErrorType.Http : ErrorType.NoConnection, error, error.error);
          return of(restError);
        } else {
          console.error(error);
        }
        return of(new RestError(ErrorType.Any, {}, {}));
      }));
    }), tap(() => {
      this.__isExecuting = false;
      this._isExecuting.next(this.__isExecuting);
      if (!this.__wasExecuted) {
        this.__wasExecuted = true;
        this._wasExecuted.next(true);
        this._neverExecuted.next(false);
        this._firstLoad.next(false);
      } else {
        this._laterLoad.next(false);
      }
    })).subscribe((result) => {
      this.__response = new RestResponse();
      if (result instanceof RestError) {
        this.__response.status = RestResponseStatus.BAD;
        this.__response.error = result;
      } else {
        this.__response.status = RestResponseStatus.GOOD;
        this.__response.result = result;
      }
      this._response.next(this.__response);
      this._isReady.next(this.__response.status === RestResponseStatus.GOOD);
      this._hasError.next(this.__response.status === RestResponseStatus.BAD);
    });
  }
  initialize() {
    if (this.canExecuteObservable) {
      this._canExecute$ = combineLatest([this._isExecuting$, this.canExecuteObservable]).pipe(map(([isExecuting, canExecuteResult]) => {
        this.__isExecuting = isExecuting;
        this.__canExecute = !isExecuting && !!canExecuteResult;
        return this.__canExecute;
      }));
      this.canExecuteSubcription = this.canExecute$.subscribe();
    } else {
      this._canExecute$ = this._isExecuting$.pipe(map((x) => {
        this.__canExecute = !x;
        return this.__canExecute;
      }));
      this.isExecutingSubcription = this._isExecuting$.pipe(tap((x) => this.__isExecuting = x)).subscribe();
    }
    this.executionPipeSubcription = this.buildExecutionPipe();
  }
  subscribeIfNeed() {
    if (!this.executionPipeSubcription) {
      this.destroyAndInitialize();
      return;
    }
    if (this.executionPipeSubcription.closed) {
      this.destroyAndInitialize();
      return;
    }
    if (this.canExecuteObservable && this.canExecuteSubcription.closed) {
      this.destroyAndInitialize();
      return;
    }
    if (this.isExecutingSubcription.closed) {
      this.destroyAndInitialize();
      return;
    }
  }
  destroyAndInitialize() {
    this.destroy();
    this.initialize();
  }
};
var ODataListResult = class {
  constructor() {
    this.value = [];
  }
};
var ODataQueryCommand = class extends BaseRestCommand {
  get state() {
    return this.queryState;
  }
  constructor(executionObservable, canExecuteObservable) {
    super(executionObservable, canExecuteObservable);
    this.executionObservable = executionObservable;
    this.canExecuteObservable = canExecuteObservable;
    this._response = new BehaviorSubject(this.__response);
    this._response$ = this._response.asObservable();
    this.queryState = new RestState();
  }
  executeOnChange(params = ["$skip", "$top", "$orderby"]) {
    super.executeOnChange(params);
    this.queryState.queryString.watch("$skip", {
      insert: true,
      update: true,
      remove: true,
      same: true
    });
  }
  executeOnAnyODataChange() {
    super.executeOnChange(["$filter", "$skip", "$top", "$orderby"]);
    this.queryState.queryString.watch("$skip", {
      insert: true,
      update: true,
      remove: true,
      same: true
    });
  }
};
var RestCommand = class extends BaseRestCommand {
  get state() {
    return this.queryState;
  }
  constructor(executionObservable, canExecuteObservable) {
    super(executionObservable, canExecuteObservable);
    this.executionObservable = executionObservable;
    this.canExecuteObservable = canExecuteObservable;
    this._response = new Subject();
    this._response$ = this._response.asObservable();
    this.queryState = new RestState();
  }
};
var RestQueryCommand = class extends BaseRestCommand {
  get state() {
    return this.queryState;
  }
  constructor(executionObservable, canExecuteObservable) {
    super(executionObservable, canExecuteObservable);
    this.executionObservable = executionObservable;
    this.canExecuteObservable = canExecuteObservable;
    this._response = new BehaviorSubject(this.__response);
    this._response$ = this._response.asObservable();
    this.queryState = new RestState();
  }
};
var _CommandButtonDirective = class _CommandButtonDirective {
  constructor(el, renderer2) {
    this.el = el;
    this.renderer2 = renderer2;
  }
  ngAfterViewInit() {
    if (this.commandButton) {
      this.setExecuting(this.commandButton.isExecuting);
      this.setDisabled(!this.commandButton.canExecute);
      this.isExecuting$ = this.commandButton.isExecuting$.subscribe((x) => {
        this.setExecuting(x);
      });
      this.canExecute$ = this.commandButton.canExecute$.subscribe((x) => {
        this.setDisabled(!x);
      });
    }
  }
  ngOnDestroy() {
    if (this.commandButton) {
      this.isExecuting$.unsubscribe();
      this.canExecute$.unsubscribe();
    }
  }
  click() {
    if (this.commandButton && this.commandButton.canExecute) {
      this.commandButton.execute();
    }
  }
  setDisabled(isDisabled) {
    if (isDisabled) {
      this.el.nativeElement.setAttribute("disabled", "disabled");
      if (this.commandDisabledClass) {
        this.renderer2.addClass(this.el.nativeElement, this.commandDisabledClass);
      }
    } else {
      this.el.nativeElement.removeAttribute("disabled");
      if (this.commandDisabledClass) {
        this.renderer2.removeClass(this.el.nativeElement, this.commandDisabledClass);
      }
    }
  }
  setExecuting(isExecuting) {
    this.el.nativeElement.setAttribute("command-executing", isExecuting ? "true" : "false");
    if (this.commnandExecutingClass) {
      if (isExecuting) {
        this.renderer2.addClass(this.el.nativeElement, this.commnandExecutingClass);
      } else {
        this.renderer2.removeClass(this.el.nativeElement, this.commnandExecutingClass);
      }
    }
  }
};
_CommandButtonDirective.ɵfac = function CommandButtonDirective_Factory(t) {
  return new (t || _CommandButtonDirective)(ɵɵdirectiveInject(ElementRef), ɵɵdirectiveInject(Renderer2));
};
_CommandButtonDirective.ɵdir = ɵɵdefineDirective({
  type: _CommandButtonDirective,
  selectors: [["", "commandButton", ""]],
  hostBindings: function CommandButtonDirective_HostBindings(rf, ctx) {
    if (rf & 1) {
      ɵɵlistener("click", function CommandButtonDirective_click_HostBindingHandler() {
        return ctx.click();
      });
    }
  },
  inputs: {
    commandButton: "commandButton",
    commandDisabledClass: "commandDisabledClass",
    commnandExecutingClass: "commnandExecutingClass"
  }
});
var CommandButtonDirective = _CommandButtonDirective;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CommandButtonDirective, [{
    type: Directive,
    args: [{
      selector: "[commandButton]"
    }]
  }], () => [{
    type: ElementRef
  }, {
    type: Renderer2
  }], {
    commandButton: [{
      type: Input
    }],
    commandDisabledClass: [{
      type: Input
    }],
    commnandExecutingClass: [{
      type: Input
    }],
    click: [{
      type: HostListener,
      args: ["click"]
    }]
  });
})();
var _CommandButtonModule = class _CommandButtonModule {
};
_CommandButtonModule.ɵfac = function CommandButtonModule_Factory(t) {
  return new (t || _CommandButtonModule)();
};
_CommandButtonModule.ɵmod = ɵɵdefineNgModule({
  type: _CommandButtonModule,
  declarations: [CommandButtonDirective],
  exports: [CommandButtonDirective]
});
_CommandButtonModule.ɵinj = ɵɵdefineInjector({});
var CommandButtonModule = _CommandButtonModule;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CommandButtonModule, [{
    type: NgModule,
    args: [{
      declarations: [CommandButtonDirective],
      imports: [],
      exports: [CommandButtonDirective]
    }]
  }], null, null);
})();
export {
  BaseRestCommand,
  CommandButtonDirective,
  CommandButtonModule,
  ErrorType,
  ODataListResult,
  ODataQueryCommand,
  RestCommand,
  RestError,
  RestQueryCommand,
  RestResponse,
  RestResponseStatus,
  RestState
};
//# sourceMappingURL=@linkway_utilities_command.js.map
