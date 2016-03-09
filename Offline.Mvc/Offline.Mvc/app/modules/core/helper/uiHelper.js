define([
    'logger',
    'durandal/app',
    'languageHelper'
], function (logger, app, languageHelper) {
    "use strict";

    var showFlag = false;
    var showCount = 0;

    return {
        loadCss: loadCss,
        loadJs: loadJs,
        ajaxPostForm: ajaxPostForm,
        showBusy: showBusy,
        hideBusy: hideBusy,
        getAutoCompleteOptions: getAutoCompleteOptions,
        getElement: getElement,
        showModalDialog: showModalDialog,
        hideModalDialog: hideModalDialog,
        getSelectedItemFromAutoComplete: getSelectedItemFromAutoComplete,
        extend: extend,
        getConfirmationI18NKey: getConfirmationI18NKey,
        showElement: showElement,
        hideElement: hideElement,
        trimValueInBracket: trimValueInBracket,
        middleScreenDialog: middleScreenDialog,
        displayHour: displayHour,
        isPageBusy: isPageBusy,
        prinPreviewtPdf: prinPreviewtPdf,
        showBusyQuoterRepricing: showBusyQuoterRepricing,
        hideBusyQuoterRepricing: hideBusyQuoterRepricing,
        isValidEmailAddress: isValidEmailAddress,
        allowScaleOnMobile: allowScaleOnMobile
    };

    function ajaxPostForm(formId, url, successCallback, errorCallback) {
        $(formId).ajaxForm({
            type: 'POST',
            url: url,
            beforeSend: function (xhr) {
                xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
            },
            success: successCallback,
            error: errorCallback
        }).submit();
    }

    function checkCSSWasLoaded(linkCss) {
        var result = false;
        $.each(document.styleSheets, function (data) {
            if (linkCss.href == data.href) {
                result = true;
            }
        });
        return result;
    }

    function loadCss(url) {
        logger.info(url);
        var linkCss = document.createElement("link");
        linkCss.type = "text/css";
        linkCss.rel = "stylesheet";
        linkCss.href = url;
        if (checkCSSWasLoaded(linkCss) === false) {
            document.getElementsByTagName("head")[0].appendChild(linkCss);
        }
    }

    function checkJsWasLoaded(linkJs) {
        var result = false;
        $.each(document.scripts, function (data) {
            if (linkJs.src == data.src) {
                result = true;
            }
        });
        return result;
    }

    function loadJs(url) {
        var linkJs = document.createElement("script");
        linkJs.type = "text/javascript";
        linkJs.src = url;
        if (checkJsWasLoaded(linkJs) === false) {
            document.getElementsByTagName("head")[0].appendChild(linkJs);
        }
    }

    function showBusy(url) {
        showCount++;
        $('#pageLoaderContainer').fadeIn(300);
    }

    function hideBusy() {
        showCount--;
        if (showCount < 0) {
            showCount = 0;
        }
        if (showCount === 0) {
            $('#pageLoaderContainer').fadeOut(500);
            app.trigger('pageLoaderContainer:hided', null);
        }
    }

    function showBusyQuoterRepricing() {
        $('#pageLoaderContainer').hide();
        $('#pageLoaderContainerQuoteRepricing').fadeIn(300);
    }

    function hideBusyQuoterRepricing() {
        $('#pageLoaderContainerQuoteRepricing').fadeOut(500);
        app.trigger('pageLoaderContainerQuoteRepricing:hided', null);
    }

    function isPageBusy() {
        return showCount > 0;
    }

    function getAutoCompleteOptions(url, displayField, valueField, callbackOnSelect, callbackPreProcess, menuTemplate) {
        return {
            ajax: {
                url: url,
                timeout: 500,
                triggerLength: 0,
                method: "get",
                loadingClass: "loading-circle",
                preDispatch: function (query) {
                    return {
                        q: query
                    };
                },
                preProcess: function (data, query) {
                    //var dataResult = (data && data.result) || data;
                    if (callbackPreProcess) {
                        callbackPreProcess(data);
                    }
                    return data;
                    //if (dataResult.length == 1 && dataResult[0][this.displayField].toLowerCase().trim() == query.toLowerCase().trim()) {
                    //    callbackOnSelect({ value: dataResult[0][this.valueField], text: dataResult[0][this.displayField] });
                    //} else {
                    //    if (callbackPreProcess) {
                    //        callbackPreProcess(data);
                    //    }
                    //    return dataResult;
                    //}
                },
                displayField: displayField,
                valueField: valueField
            },
            menu: menuTemplate,
            display: displayField,
            val: valueField,
            onSelect: callbackOnSelect
        };
    }

    function getElement(elementId) {
        return $(elementId);
    }

    function showModalDialog(elementId) {
        var el = $(elementId);

        if (el.hasClass('modal')) el.addClass('dialog-backdrop');

        el.show();
        el.modal({
            keyboard: false
        });
        var dialogId = elementId + " .fixed-middle-screen-dialog";
        middleScreenDialog(dialogId);

        // TODO: calculate dialog position before showing
        el.find('> div').show();

        $('body').css('overflow', 'hidden');

        window.onresize = function () {
            middleScreenDialog(dialogId);
        };


        $('.dialog .close').bind('click.dialog_close', function () {
            $('.dialog .close').unbind('click.dialog_close');
            $('body').css('overflow', 'visible');
        });
    }
    function hideModalDialog(elementId) {
        $(elementId).hide();
        $(elementId).modal("hide");
        $('body').css('overflow', 'visible');
    }

    function showElement(element) {
        $(element).css("display", "block");
    }

    function hideElement(element) {
        $(element).css("display", "none");
    }
    function getSelectedItemFromAutoComplete(element) {
        if ($(element)) {
            if ($(element).parent().children(".dropdown-menu") &&
                $(element).parent().children(".dropdown-menu").children(".active").length > 0) {
                var selectedItem = $(element).parent().children(".dropdown-menu").children(".active")[0];
                $(selectedItem).removeClass("active");
                return selectedItem;
            }
        }
        return null;
    }

    function extend(elementSource, elementDestination) {
        return $.extend(elementSource, elementDestination);
    }

    function getConfirmationI18NKey(confirmed) {
        return confirmed ? 'common:string.confirmed' : 'common:string.unconfirmed';
    }

    function trimValueInBracket(value) {
        var start = value.indexOf("(");
        var end = value.indexOf(")");
        var valueSubstr = value.substr(start, end - start + 1);
        return $.trim(value.replace(valueSubstr, ""));
    }
    function middleScreenDialog(elementId) {
        var el = $(elementId);
        if (el.length > 0) {
            var windowHeight = $(window).height();
            var parent = el.parent();
            var height = el.height();
            var marginTop = (windowHeight - height) / 2;
            if (marginTop < 0) {
                marginTop = 0;
            }
            el.css({ "margin-top": marginTop + "px" });
            parent.height($(document).height());
            // fixed:
            $('.dialog-backdrop').css({ "margin-top": "0px" });
        }
    }
    function displayHour(timeValue, format) {
        var m = timeValue.split(":");
        return m.length > 1 ? moment({ hour: Number(m[0]), minute: Number(m[1]), second: Number((m.length === 3) && m[2]) }).format(format) : "";
    }
    function prinPreviewtPdf(path) {
        var data = '<iframe src="' + path + '" width="100%" height="925px"></iframe>';
        var w = window.open("", "_blank");
        w.focus();
        $(w.document.body).html(data);
    }

    function allowScaleOnMobile(isScale) {
        if (isMobile()) {
            $(".logo").css('display', 'none');
            $(".left-command a.invisible-mobile").attr('style', 'display: block !important');
            $('meta[name=viewport]').remove();
            var metaElement = document.createElement("meta");
            metaElement.name = "viewport";
            if (isScale) {
                metaElement.content = "width=device-width, initial-scale=0.4, maximum-scale=1000, minimum-scale=0.4, user-scalable=yes";

            } else {
                metaElement.content = "width=device-width, initial-scale=1.0, maximum-scale=1, minimum-scale=1, user-scalable=no";
            }
            document.getElementsByTagName("head")[0].appendChild(metaElement);
        }
    }

    function isMobile() {
        var a = navigator.userAgent || navigator.vendor || window.opera;
        return /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4));
    }
    function isValidEmailAddress(emailAddress) {
        var pattern = new RegExp(/^[+a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i);
        return pattern.test(emailAddress);
    }
});
