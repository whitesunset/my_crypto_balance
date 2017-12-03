'use strict'; module.exports = angular.module('app').run(['$templateCache', function($templateCache) {$templateCache.put('dashboard.html','<div ng-controller="DashboardCtrl as $ctrl">\n    <div ng-if="$ctrl.loaded">\n        <!-- Header -->\n        <app-header></app-header>\n\n        <div class="container">\n            <div class="panel panel-default panel-table">\n                <div class="panel-body">\n                    <!-- Summary -->\n                    <div class="summary" ng-show="$ctrl.storage.coins.length > 0">\n                        <span>\n                            {{$ctrl.getTotal(\'btc\')}}\n                            <small>BTC</small>\n                        </span>\n                        <span>\n                            {{(\'\' + $ctrl.getTotal($ctrl.storage.settings.currency)).toLocaleString()}}\n                            <small>{{$ctrl.storage.settings.currency}}</small>\n                        </span>\n                    </div>\n                    <!-- Data table -->\n                    <table class="table table-striped" ng-show="$ctrl.storage.coins.length > 0">\n                        <thead>\n                        <tr>\n                            <th class="index">#</th>\n                            <th class="symbol">Coin</th>\n                            <th class="count text-center">Amount</th>\n                            <th class="price_btc text-center">BTC Price</th>\n                            <th class="sum_btc text-center">BTC Total</th>\n                            <th class="price_currency text-center">{{$ctrl.storage.settings.currency}} Price</th>\n                            <th class="sum_currency text-center">{{$ctrl.storage.settings.currency}} Total</th>\n                            <th class="actions"></th>\n                        </tr>\n                        </thead>\n                        <tbody>\n                        <tr ng-repeat="coin in $ctrl.storage.coins track by $index">\n                            <td colspan="8" class="td-wrapper">\n                                <table class="inner-table">\n                                    <tr>\n                                        <td class="index">{{$index + 1}}</td>\n                                        <td class="symbol">\n                                        <span ng-if="coin.id">\n                                            <img ng-src="https://files.coinmarketcap.com/static/img/coins/16x16/{{coin.id}}.png"\n                                                 width="16"\n                                                 height="16"\n                                                 alt="{{coin.id | capitalize}}">\n                                        </span>\n                                            {{coin.symbol}}\n                                            <span ng-if="coin.note" class="note">({{coin.note}})</span>\n                                        </td>\n                                        <td class="count text-center">\n                                            {{coin.amount}}\n                                        </td>\n                                        <td class="price_btc text-center"\n                                            ng-class="{green: $ctrl.getChange(coin.symbol), red: !$ctrl.getChange(coin.symbol)}">\n                                            {{$ctrl.price(coin.symbol, \'btc\')}} BTC\n                                        </td>\n                                        <td class="sum_btc text-center"\n                                            ng-class="{green: $ctrl.getChange(coin.symbol), red: !$ctrl.getChange(coin.symbol)}">\n                                            {{$ctrl.sum($index, \'btc\')}} BTC\n                                        </td>\n                                        <td class="price_currency text-center"\n                                            ng-class="{green: $ctrl.getChange(coin.symbol), red: !$ctrl.getChange(coin.symbol)}">\n                                            {{$ctrl.price(coin.symbol, $ctrl.storage.settings.currency)}}\n                                        </td>\n                                        <td class="sum_currency text-center"\n                                            ng-class="{green: $ctrl.getChange(coin.symbol), red: !$ctrl.getChange(coin.symbol)}">\n                                            {{$ctrl.sum($index, $ctrl.storage.settings.currency)}}\n                                        </td>\n                                        <td class="actions text-right">\n                                        <span class="icon-chart"\n                                              title="Chart"\n                                              ng-click="$ctrl.toggleChart($index)"></span>\n                                            <span class="icon-edit-modify-streamline"\n                                                  title="Edit"\n                                                  ng-click="$ctrl.editCoin($index)"></span>\n                                            <span class="icon-delete-garbage-streamline"\n                                                  title="Remove"\n                                                  ng-click="$ctrl.removeCoin($index)"></span>\n                                        </td>\n                                    </tr>\n                                    <tr>\n                                        <td colspan="7" class="td-wrapper">\n                                            <div class="chart" id="chart_{{$index}}"></div>\n                                        </td>\n                                    </tr>\n                                </table>\n                            </td>\n                        </tr>\n                        </tbody>\n                    </table>\n                    <!-- No coins tracking message -->\n                    <div ng-show="$ctrl.storage.coins.length == 0" class="text-center no-coins">\n                        Zero coins tracking.\n                        <span class="link" ng-click="$ctrl.addCoin()">Add first!</span>\n                    </div>\n                </div>\n            </div>\n        </div>\n        <!-- Footer -->\n        <app-footer></app-footer>\n    </div>\n    <!-- Loading screen -->\n    <div class="loading colorful" ng-show="!$ctrl.loaded">\n        <div>\n            <p>{{$ctrl.loadingMessage}}</p>\n            <img src="img/loading.svg" width="256" height="32">\n        </div>\n    </div>\n</div>');
$templateCache.put('login.html','<div class="login" ng-controller="LoginCtrl as $ctrl">\n    <img src="img/wallet.svg" alt="">\n    <form ng-submit="$ctrl.login()">\n        <input required\n               autofocus\n               type="password"\n               ng-model="$ctrl.passphrase"\n               class="form-control"\n               placeholder="Enter passphrase">\n        <input type="submit"\n               class="btn btn-primary btn-block"\n               value="Submit">\n    </form>\n    <p>\n        <span ng-click="$ctrl.openImport()">{{$ctrl.importString}}</span>\n    </p>\n</div>');
$templateCache.put('components/footer.html','<div class="container" ng-controller="FooterCtrl as $ctrl">\n    <div class="app-footer">\n        <div class="counter" ng-show="$ctrl.storage.coins.length > 0">\n            Next update in {{$ctrl.getCounter()}}\n        </div>\n        <ul>\n            <li>\n                <a href="{{$ctrl.repo}}"\n                   target="_blank"\n                   title="Source code">\n                    <span class="icon-github-square"></span>\n                </a>\n            </li>\n        </ul>\n    </div>\n</div>');
$templateCache.put('components/header.html','<div class="header" ng-controller="HeaderCtrl as $ctrl">\n    <div class="container">\n        <div class="app-header">\n            <h3>\n                <img src="img/bitcoin.svg" alt="Bitcoin">\n                My Crypto Balance\n            </h3>\n            <div class="progress" ng-if="$ctrl.storage.settings.goal">\n                <div class="progress-bar progress-bar-success"\n                     role="progressbar"\n                     style="width: {{$ctrl.getPercent(\'goal_limit\')}}%;">\n                </div>\n                <span>\n            {{$ctrl.getPercent(\'goal_limit\')}}%\n            of\n            {{$ctrl.storage.settings.goal_limit.toLocaleString()}}\n            {{$ctrl.storage.settings.currency}}\n        </span>\n            </div>\n            <div class="progress" ng-if="$ctrl.storage.settings.subgoal">\n                <div class="progress-bar progress-bar-info"\n                     role="progressbar"\n                     style="width: {{$ctrl.getPercent(\'subgoal_limit\')}}%;">\n                </div>\n                <span>\n            {{$ctrl.getPercent(\'subgoal_limit\')}}%\n            of\n            {{$ctrl.storage.settings.subgoal_limit.toLocaleString()}}\n            {{$ctrl.storage.settings.currency}}\n        </span>\n            </div>\n            <nav>\n                <ul class="nav nav-pills pull-right">\n                    <li class="active">\n                        <button class="btn btn-sm btn-default"\n                                ng-click="$ctrl.addCoin()"\n                                title="Track new coin">New Saving</button>\n                        <button class="btn btn-sm btn-default btn-icon"\n                                ng-click="$ctrl.openSettings()"\n                                title="Settings">\n                            <span class="icon-settings-streamline-1"></span>\n                        </button>\n                        <button class="btn btn-sm btn-default btn-icon"\n                                ng-click="$ctrl.logout()"\n                                title="Logout">\n                            <span class="icon-logout"></span>\n                        </button>\n                    </li>\n                </ul>\n            </nav>\n        </div>\n    </div>\n</div>');
$templateCache.put('components/forms/coin.html','<div class="modal fade modal-coin">\n    <div class="modal-dialog">\n        <div class="modal-content">\n            <div class="modal-header">\n                <button type="button" class="close" data-dismiss="modal" aria-label="Close">\n                    <span aria-hidden="true">&times;</span>\n                </button>\n                <h4 class="modal-title">{{mode == \'edit\' ? \'Edit Coin\' : \'Add Coin\'}}</h4>\n            </div>\n            <div class="modal-body">\n                <form class="form-horizontal">\n                    <div class="form-group">\n                        <label class="col-sm-4 control-label" for="symbol">Coin</label>\n                        <div class="col-sm-8">\n                            <input class="form-control input-sm"\n                                   id="symbol"\n                                   ng-model="coin.symbol"\n                                   type="text"\n                                   placeholder="BTC"/>\n                        </div>\n                    </div>\n                    <div class="form-group">\n                        <label class="col-sm-4 control-label" for="amount">Amount</label>\n                        <div class="col-sm-8">\n                            <input class="form-control input-sm"\n                                   id="amount"\n                                   type="number"\n                                   min="0"\n                                   step="0.00000001"\n                                   ng-model="coin.amount"\n                                   placeholder="">\n                        </div>\n                    </div>\n                    <div class="form-group">\n                        <label class="col-sm-4 control-label" for="note">Note</label>\n                        <div class="col-sm-8">\n                            <select class="form-control"\n                                    id="note"\n                                    ng-model="coin.note">\n                                <option value="">Optional note</option>\n                                <option ng-repeat="note in notes" value="{{note}}">{{note}}</option>\n                            </select>\n                        </div>\n                    </div>\n                </form>\n            </div>\n            <div class="modal-footer">\n                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>\n                <button type="button"\n                        class="btn btn-primary"\n                        data-dismiss="modal"\n                        ng-click="save(\'lol\')"\n                        ng-disabled="!valid()">\n                    Save\n                </button>\n            </div>\n        </div>\n    </div>\n</div>');
$templateCache.put('components/forms/import.html','<div class="modal fade">\n    <div class="modal-dialog">\n        <div class="modal-content">\n            <div class="modal-header">\n                <button type="button" class="close" data-dismiss="modal" aria-label="Close">\n                    <span aria-hidden="true">&times;</span>\n                </button>\n                <h4 class="modal-title">Import</h4>\n            </div>\n            <div class="modal-body">\n                <form class="form-horizontal">\n                    <div class="form-group">\n                        <label class="col-sm-4 control-label" for="string">Encrypted string</label>\n                        <div class="col-sm-8">\n                            <textarea class="form-control input-sm input-import"\n                                      id="string"\n                                      ng-model="string"></textarea>\n                        </div>\n                    </div>\n                </form>\n            </div>\n            <div class="modal-footer">\n                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>\n                <button type="button"\n                        class="btn btn-primary"\n                        data-dismiss="modal"\n                        ng-click="import()">\n                    Import\n                </button>\n            </div>\n        </div>\n    </div>\n</div>');
$templateCache.put('components/forms/settings.html','<div class="modal fade">\n    <div class="modal-dialog">\n        <div class="modal-content">\n            <div class="modal-header">\n                <button type="button" class="close" data-dismiss="modal" aria-label="Close">\n                    <span aria-hidden="true">&times;</span>\n                </button>\n                <h4 class="modal-title">Settings</h4>\n            </div>\n            <div class="modal-body">\n                <form class="form-horizontal">\n                    <div class="form-group">\n                        <div class="col-sm-offset-4 col-sm-8">\n                            <div class="checkbox">\n                                <label>\n                                    <input type="checkbox"\n                                           ng-model="settings.goal"/>\n                                    Enable Main Goal\n                                </label>\n                            </div>\n                        </div>\n                    </div>\n                    <div class="form-group" ng-show="settings.goal">\n                        <label class="col-sm-4 control-label" for="settings_goal">Main Goal</label>\n                        <div class="col-sm-8">\n                            <div class="input-group">\n                                <input class="form-control input-sm"\n                                       id="settings_goal_limit"\n                                       ng-model="settings.goal_limit"\n                                       type="text"\n                                       placeholder="For example: 100 000"/>\n                                <span class="input-group-addon">\n                                    {{settings.currency}}\n                                </span>\n                            </div>\n                        </div>\n                    </div>\n                    <div class="form-group">\n                        <div class="col-sm-offset-4 col-sm-8">\n                            <div class="checkbox">\n                                <label>\n                                    <input type="checkbox"\n                                           ng-model="settings.subgoal"/>\n                                    Enable Sub Goal\n                                </label>\n                            </div>\n                        </div>\n                    </div>\n                    <div class="form-group" ng-show="settings.subgoal">\n                        <label class="col-sm-4 control-label" for="settings_goal">Sub Goal</label>\n                        <div class="col-sm-8">\n                            <div class="input-group">\n                                <input class="form-control input-sm"\n                                       id="settings_subgoal_limit"\n                                       ng-model="settings.subgoal_limit"\n                                       type="text"\n                                       placeholder="For example: 10 000"/>\n                                <span class="input-group-addon">\n                                            {{settings.currency}}\n                                        </span>\n                            </div>\n                        </div>\n                    </div>\n                    <div class="form-group">\n                        <label class="col-sm-4 control-label" for="settings_currency">Default Currency</label>\n                        <div class="col-sm-8">\n                            <select class="form-control input-sm"\n                                    id="settings_currency"\n                                    ng-model="settings.currency">\n                                <option ng-repeat="currency in currencies" value="{{currency}}">\n                                    {{currency}}\n                                </option>\n                            </select>\n                        </div>\n                    </div>\n                    <div class="form-group">\n                        <label class="col-sm-4 control-label" for="settings_export">Export</label>\n                        <div class="col-sm-8">\n                            <div class="form-control well input-export">\n                                {{export()}}\n                            </div>\n                        </div>\n                    </div>\n                </form>\n            </div>\n            <div class="modal-footer">\n                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>\n                <button type="button"\n                        class="btn btn-primary"\n                        data-dismiss="modal"\n                        ng-click="save()">\n                    Save\n                </button>\n            </div>\n        </div>\n    </div>\n</div>');}]);