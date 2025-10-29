/**
 * Mixin used to add system flags enforcement to types.
 * @template {foundry.abstract.Document} T
 * @param {typeof T} Base  The base document class to wrap.
 * @returns {typeof SystemFlags}
 * @mixin
 */
export default function SystemFlagsMixin(Base) {
  class SystemFlags extends Base {
    /**
     * Get the data model that represents system flags.
     * @type {typeof DataModel|null}
     * @abstract
     */
    get _systemFlagsDataModel() {
      return null;
    }

    /* -------------------------------------------- */

    /** @inheritDoc */
    prepareData() {
      super.prepareData();
      const flagScope = game.system.id;
      if ( (flagScope in this.flags) && this._systemFlagsDataModel ) {
        this.flags[flagScope] = new this._systemFlagsDataModel(this._source.flags[flagScope], { parent: this });
      }
    }

    /* -------------------------------------------- */

    /** @inheritDoc */
    async setFlag(scope, key, value) {
      const flagScope = game.system.id;
      if ( (scope === flagScope) && this._systemFlagsDataModel ) {
        let diff;
        const changes = foundry.utils.expandObject({ [key]: value });
        if ( this.flags[flagScope] ) diff = this.flags[flagScope].updateSource(changes, { dryRun: true });
        else diff = new this._systemFlagsDataModel(changes, { parent: this }).toObject();
        return this.update({ flags: { [flagScope]: diff } });
      }
      return super.setFlag(scope, key, value);
    }
  }
  return SystemFlags;
}
