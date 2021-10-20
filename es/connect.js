import { subscribe, getState } from "./store";
import { isEqualForArray } from "./util";

function trySubscribe() {
  if (!this._unsubscribe) {
    this._unsubscribe = subscribe(this._dealPageState.bind(this));
    this._dealPageState();
  }
}

function tryUnsubscribe() {
  if (this._unsubscribe) {
    this._unsubscribe();
    this._unsubscribe = null;
  }
}

const connect = Behavior({
  attached() {
    trySubscribe.call(this);
  },

  detached() {
    tryUnsubscribe.call(this);
  },

  pageLifetimes: {
    show() {
      trySubscribe.call(this);
    },

    hide() {
      tryUnsubscribe.call(this);
    },
  },

  definitionFilter(defFields) {
    const selector = defFields.selector;
    if (!selector) {
      throw new Error("no selector function");
    }

    if (!defFields.data) {
      defFields.data = {};
    }
    defFields.data._prevDeps = null;

    if (!defFields.methods) {
      defFields.methods = {};
    }
    defFields.methods._selector = selector;

    if (defFields.stateUpdated) {
      defFields.methods._stateUpdated = defFields.stateUpdated;
    }
  },

  methods: {
    _dealPageState() {
      const { deps, renderFn } = this._selector(this.data);

      const { _prevDeps } = this.data;
      if (!_prevDeps) {
        this.setData({ ...(renderFn(...deps)), _prevDeps: deps });
        return;
      }

      const needUpdate = !isEqualForArray(deps, _prevDeps);
      if (!needUpdate) {
        return;
      }

      this.setData({ ...(renderFn(...deps)), _prevDeps: deps }, () => {
        if (this._stateUpdated) {
          this._stateUpdated(renderFn(..._prevDeps));
        }
      });
    },
  },
});

const stateSelector = (_createSelector, data) => _createSelector(data);

const createSelector = (...args) => (data) => {
  if (!args || (args && args.length <= 1)) {
    return null;
  }

  const depFnList = args.slice(0, -1);
  const renderFn = args[args.length - 1];

  const state = getState();
  const depList = depFnList.map((getDep) => getDep(state, data));

  return { deps: depList, renderFn };
};

export { connect, stateSelector, createSelector };
