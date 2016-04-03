define(['knockout',
    'languageHelper',
    'config/appSettings'],
    function (ko, languageHelper, appSettings) {
    "use strict";

    var customBinding = {
        registerCustomBinding: function () {
            ko.bindingHandlers.select2 = {
                stopUpdateBinding: false,
                buildDataSource: function (source, valueProp, textProp) {
                    var unwrap = ko.utils.unwrapObservable;
                    var mapped = ko.utils.arrayMap(source, function (item) {
                        var result = {};
                        result.text = textProp ? unwrap(item[textProp]) : unwrap(item).toString();  //show in pop-up choices
                        result.id = valueProp ? unwrap(item[valueProp]) : JSON.stringify(item);  //value 
                        result.dataRaw = item;
                        return result;
                    });
                    return mapped;
                },
                init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                    var unwrap = ko.utils.unwrapObservable;
                    var bindingData = valueAccessor();
                    var source = unwrap(bindingData.source);
                    var controlEvent = bindingData.controlEvent;

                    var isRequired = unwrap(bindingData.isRequired) || false;
                    var valueProp = unwrap(bindingData.optionsValue);
                    var textProp = unwrap(bindingData.optionsText) || valueProp;
                    var selectedValue = bindingData.selectedValue || ko.observable();
                    var selectedText = bindingData.selectedText || ko.observable();
                    var selectedItem = bindingData.selectedItem || ko.observable();
                    var selectedItems = bindingData.selectedItems || ko.observableArray([]);
                    var allowClear = unwrap(bindingData.allowClear) || false;
                    var hasError = unwrap(bindingData.hasError) || false;
                    var errorClass = unwrap(bindingData.errorClass) || '';
                    var changeHandle = bindingData.change || function () { };
                    var placeholder = unwrap(bindingData.placeholder) || '';//this is i18nkey
                    var minimumInputLength = unwrap(bindingData.minimumInputLength) || 0;
                    var disableSearchBox = unwrap(bindingData.disableSearchBox) || false;
                    var enable = unwrap(bindingData.enable) === undefined ? true : unwrap(bindingData.enable);
                    var multiSelected = unwrap(bindingData.multiSelected) === undefined ? false : unwrap(bindingData.multiSelected);
                    var authToken = unwrap(bindingData.authToken) === undefined ? "" : unwrap(bindingData.authToken);
                    var searchingMsg = languageHelper.getString('common.searching', 'common');
                    var noMatchesFoundMsg = languageHelper.getString('common.noMatchesFound', 'common');
                    var maxItemsReachedMsg = String.format(languageHelper.getString('common.maxItemsReached', 'common'), appSettings.maxRecords);
                    var textSearch = bindingData.textSearch || ko.observable();
                    var autoSearchSelected = bindingData.autoSearchSelected;
                    var allowDropUp = _.isUndefined(unwrap(bindingData.allowDropUp)) ? true : unwrap(bindingData.allowDropUp);
                    //Bug fixing for employee login screen on firefox
                    $(element).val('');

                    var options = {
                        allowDropUp: allowDropUp,
                        allowClear: allowClear,
                        minimumResultsForSearch: disableSearchBox ? -1 : 0,
                        minimumInputLength: minimumInputLength,
                        placeholder: String.isNullOrWhiteSpace(placeholder) ? '' : languageHelper.getString(placeholder, null, true),
                        noMatchesFoundMsg: noMatchesFoundMsg,
                        maxItemsReachedMsg: maxItemsReachedMsg,
                        multiple: multiSelected,
                        blurOnChange: true,
                        closeOnSelect: multiSelected !== true,
                        autoSearchSelected: autoSearchSelected,
                        formatSearching: function () {
                            return searchingMsg;
                        },
                        formatNoMatches: function () {
                            return noMatchesFoundMsg;
                        },
                        formatMaxItemsReached: function () {
                            return maxItemsReachedMsg;
                        }
                    };

                    if (source !== undefined && source !== null) {
                        if (typeof source === 'string' || source instanceof String) {
                            options.ajax = {
                                url: source,
                                dataType: "json",
                                contentType: "application/json",
                                headers: { 'X-AUTH-TOKEN': authToken },
                                data: function (term, page) {
                                    //if (textSearch && ko.isWriteableObservable(textSearch)) {
                                    //    textSearch(term);
                                    //}

                                    if (controlEvent) {
                                        var params = controlEvent.runParams;
                                        params.push({ name: "searchText", value: term });
                                    }
                                    return controlEvent;
                                    //return {
                                    //    q: term
                                    //};
                                },
                                type: 'POST',
                                results: function (data, page) {
                                    var dataResult = data.result ? data.result : data;
                                    if (autoSearchSelected && String.isNullOrWhiteSpace(textSearch())) {
                                        var currentSelectedItem = {};
                                        if (selectedItem()) {
                                            if (selectedItem().dataRaw) {
                                                currentSelectedItem = selectedItem().dataRaw;
                                            } else {
                                                currentSelectedItem[textProp] = selectedItem()[textProp];
                                                currentSelectedItem[valueProp] = selectedItem()[valueProp];
                                            }
                                        } else if (selectedValue() && selectedText()) {
                                            currentSelectedItem[textProp] = selectedText();
                                            currentSelectedItem[valueProp] = selectedValue();
                                        } else {
                                            currentSelectedItem = null;
                                        }
                                        if (currentSelectedItem && dataResult.length > 0) {
                                            if (currentSelectedItem[valueProp] != dataResult[0][valueProp]) {
                                                dataResult.unshift(currentSelectedItem);
                                                dataResult.splice(-1, 1);
                                            }
                                        }
                                    }
                                    var results = ko.bindingHandlers.select2.buildDataSource(dataResult, valueProp, textProp);
                                    var select2 = $(element).data('select2');
                                    if (select2 && select2.opts) {
                                        select2.opts.data = { results: results };
                                    }

                                    return { results: results, maxItemsReached: data.maxItemsReached };
                                }
                            };
                        }
                        else {
                            var data = ko.bindingHandlers.select2.buildDataSource(source, valueProp, textProp);
                            options.data = { results: data };
                        }
                    }
                    else {
                        options.data = [];
                    }

                    $(element).select2(options);
                    $(element).on('change', function (e) {
                        var arg = {
                            selectedValue: e.val,
                            selectedItem: { value: '', text: '', dataRaw: null },
                            selectedItems: [],
                            action: e.removed ? enums.select2Action.remove : e.added ? enums.select2Action.add : undefined
                        };

                        if (e.added) {
                            if (ko.isWriteableObservable(selectedValue)) {
                                selectedValue(e.val);
                            }

                            if (ko.isWriteableObservable(selectedText)) {
                                selectedText(e.added.text);
                            }
                            if (ko.isWriteableObservable(selectedItem)) {
                                selectedItem(e.added);
                            }
                            arg.selectedItem = { value: e.added.id, text: e.added.text, dataRaw: e.added.dataRaw };

                        }


                        var select2 = $(element).data('select2');
                        if (multiSelected && select2.opts.data.results.length > 0) {
                            //ko.bindingHandlers.select2.stopUpdateBinding = true;
                            if (ko.isWriteableObservable(selectedItems) && _.isArray(selectedItems())) {
                                if (e.added || e.removed) {
                                    var selected = e.added || e.removed;
                                    var existed = _.find(selectedItems(), function (item) {
                                        return commonHelper.isEqual(selected.dataRaw[valueProp], item[valueProp]);
                                    });

                                    if (existed === undefined && e.added) {
                                        selectedItems.push(e.added.dataRaw);
                                    } else if (existed !== undefined && e.removed) {
                                        selectedItems.remove(function (item) {
                                            return commonHelper.isEqual(item[valueProp], selected.dataRaw[valueProp]);
                                        });
                                    }
                                }
                                //selectedItems(arg.selectedItems);
                            }
                            // ko.bindingHandlers.select2.stopUpdateBinding = false;
                        }
                        arg.selectedItems = selectedItems();

                        changeHandle(arg, bindingContext.$data);
                    });
                    $(element).select2("enable", enable);
                },
                update: function (element, valueAccessor, allBindingsAccessor) {
                    //if (!ko.bindingHandlers.select2.stopUpdateBinding || 1===1) {
                    var unwrap = ko.utils.unwrapObservable;
                    var bindingData = valueAccessor();
                    var controlEvent = bindingData.controlEvent;

                    var source = unwrap(bindingData.source);
                    var isRequired = unwrap(bindingData.isRequired) || false;
                    var valueProp = unwrap(bindingData.optionsValue);
                    var textProp = unwrap(bindingData.optionsText) || valueProp;
                    var selectedValue = bindingData.selectedValue || ko.observable();
                    var selectedText = bindingData.selectedText || ko.observable();
                    var selectedItem = bindingData.selectedItem || ko.observable();
                    var selectedItems = bindingData.selectedItems;
                    var allowClear = unwrap(bindingData.allowClear) || false;
                    var hasError = unwrap(bindingData.hasError) || false;
                    var errorClass = unwrap(bindingData.errorClass) || '';
                    var changeHandle = bindingData.change || function () { };
                    var placeholder = unwrap(bindingData.placeholder) || '';
                    var minimumInputLength = unwrap(bindingData.minimumInputLength) || 0;
                    var disableSearchBox = unwrap(bindingData.disableSearchBox) || false;
                    var enable = unwrap(bindingData.enable) === undefined ? true : unwrap(bindingData.enable);
                    var multiSelected = unwrap(bindingData.multiSelected) === undefined ? false : unwrap(bindingData.multiSelected);
                    var forceUpdateDataSource = unwrap(bindingData.forceUpdateDataSource) === undefined ? false : unwrap(bindingData.forceUpdateDataSource);
                    var select2 = $(element).data('select2');
                    var isSourceByUrl = null;
                    if (select2 && select2.opts) {
                        if (source) {
                            if (typeof source === 'string' || source instanceof String) {
                                if (select2.opts.ajax && select2.opts.ajax.url !== source) {
                                    select2.opts.ajax.url = source;
                                    select2.opts.query = select2.opts.createAjax.call(select2.opts.element, select2.opts.ajax);
                                }
                                isSourceByUrl = true;
                            }
                            else {
                                if (select2.opts.data) {
                                    if (source && _.isArray(source) && source.length > 0) {
                                        var data = ko.bindingHandlers.select2.buildDataSource(source, valueProp, textProp);
                                        select2.opts.data.results = data;
                                    }
                                    else {
                                        select2.opts.data.results = [];
                                    }
                                }
                                isSourceByUrl = false;
                            }
                        }
                    }
                    var initData = [];
                    var currentModelValue = null;
                    var currentModelText = null;
                    if (selectedItems && _.isArray(selectedItems())) {
                        _.each(selectedItems(), function (item) {
                            var obj = {};
                            obj[valueProp] = item[valueProp];
                            obj[textProp] = item[textProp];
                            initData.push(obj);
                        });

                    } else {
                        console.log("value: " + unwrap(selectedValue) + ", text: " + unwrap(selectedText) + ", select2Value: " + $(element).select2("val"));
                        currentModelValue = unwrap(selectedValue);
                        var tempSelectedItem;
                        if (!currentModelValue) {
                            if (selectedItem && selectedItem()) {
                                tempSelectedItem = selectedItem().dataRaw ? selectedItem().dataRaw : selectedItem();
                                currentModelValue = valueProp ? unwrap(tempSelectedItem[valueProp]) : unwrap(selectedItem() || '').toString();
                            }
                        }

                        currentModelText = unwrap(selectedText);
                        if (!currentModelText) {
                            if (selectedItem && selectedItem()) {
                                tempSelectedItem = selectedItem().dataRaw ? selectedItem().dataRaw : selectedItem();
                                currentModelText = textProp ? unwrap(tempSelectedItem[textProp]) : unwrap(selectedItem() || '').toString();
                            }
                        }

                        currentModelText = currentModelText || currentModelValue;
                        if (currentModelValue !== undefined && currentModelValue !== null && currentModelValue !== $(element).select2("val")) {
                            var obj = {};
                            obj[valueProp] = currentModelValue;
                            obj[textProp] = currentModelText;
                            initData.push(obj);
                        }
                    }

                    if (initData.length > 0) {
                        if (!select2.opts.data || !select2.opts.data.results || select2.opts.data.results.length === 0 || forceUpdateDataSource) {

                            var items = ko.bindingHandlers.select2.buildDataSource(initData, valueProp, textProp);
                            select2.opts.data = { results: items };
                            select2.opts.initSelection = function (el, callback) {
                                if (select2.opts.data && select2.opts.data.results) {
                                    callback(multiSelected ? select2.opts.data.results : select2.opts.data.results[0]);
                                } else {
                                    if (multiSelected) {
                                        callback([]);
                                    }
                                    else {
                                        callback({});
                                    }

                                }
                            };
                        }
                        var displayValues = [];
                        _.each(initData, function (item) {
                            displayValues.push(item[valueProp]);
                        });
                        $(element).select2("val", displayValues.length > 1 ? displayValues : displayValues[0]);
                    }
                    else if ((currentModelValue === undefined || currentModelValue === null) && allowClear) {
                        $(element).select2("val", "");
                    }

                    if (hasError) {
                        $($(element).select2("container")).addClass(errorClass);
                    }
                    else {
                        $($(element).select2("container")).removeClass(errorClass);
                    }
                    $(element).select2("enable", enable);
                    //}
                    //ko.bindingHandlers.select2.stopUpdateBinding = false;


                    //The only item and isRequired -> set default for this item.                    
                    //amplifyDataContext.get('getDataItems', options.ajax.url + "?q=", null, function (data) {
                    //    if (data.result.length === 1) {
                    //            //set html
                    //            $(".select2-container").html('<a href="javascript:void(0)" onclick="return false;" class="select2-choice" tabindex="-1">' +
                    //                    '<span class="select2-chosen">' + data.result[0].name  + '</span>' +
                    //                    '<abbr class="select2-search-choice-close"></abbr>' +
                    //                    '<span class="select2-arrow"><b></b></span>' +
                    //                '</a>' +
                    //                '<input class="select2-focusser select2-offscreen" type="text" id="s2id_autogen2" tabindex="1">');
                    //        }
                    //});
                    var prepareUrl = function (url) {
                        if (url.indexOf("?q=") > 0 || url.indexOf("&q=") > 0) {
                            return url;
                        } else {
                            if (url.indexOf("?") > 0) {
                                if (url.indexOf("?") === (url.length - 1)) {
                                    return url + "q=";
                                }
                                return url + "&q=";
                            } else {
                                return url + "?q=";
                            }
                        }
                    }

                    if (isRequired === true && isSourceByUrl === true) {
                        $.ajax({
                            type: "POST",
                            url: prepareUrl(select2.opts.ajax.url),
                            contentType: "application/json; charset=utf-8",
                            async: false,
                            success: function (data) {
                                if (data.result.length === 1) {
                                    selectedValue(data.result[0][valueProp]);
                                    selectedText(data.result[0][textProp]);

                                    var id = "#" + element.previousSibling.id + " .select2-choice";
                                    $(id).html('' +
                                            '<span class="select2-chosen">' + data.result[0].name + '</span>' +
                                            '<abbr class="select2-search-choice-close"></abbr>' +
                                            '<span class="select2-arrow"><b></b></span>' +
                                        '');
                                    $("#" + element.previousSibling.id).find("*").off();
                                }
                            }
                        });
                    }
                }
            };


        }
    };

    return customBinding;
});