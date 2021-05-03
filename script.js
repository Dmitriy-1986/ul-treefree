$(document).ready(function () {
    var treeState = { // объект, который хранит состояния веток
        state: JSON.parse(localStorage.getItem('branchOpened')) || {},
        setOpened: function (element) {
            this.state[this._getKey(element)] = true;
            this._save();
        },
        setClosed: function (element) {
            delete this.state[this._getKey(element)];
            this._save();
        },
        isClosed: function (element) {
            return !this.state[this._getKey(element)];
        },
        _save: function () {
            localStorage.setItem('branchOpened', JSON.stringify(this.state));
        },
        _getKey: function (element) {
            var ixs = [];
            $(element).parentsUntil('ul-dropfree', 'li')
                .each(function (ix, item) {
                    ixs.unshift($(item).index());
                });
            return ixs.join(',');
        }
    };
    $('.ul-dropfree').find('li:has(ul:has(li))').prepend('<div class="drop"></div>');
    $('.ul-dropfree div.drop').click(function () {
        var branch = $(this).nextAll('ul').first();
        if (branch.css('display') == 'none') {
            branch.slideDown(400);
            $(this).css({ 'background-position': '-11px 0px' });
            // сохраняем состояние ветви
            treeState.setOpened(branch);
        }
        else {
            branch.slideUp(400);
            $(this).css({ 'background-position': '0 0' });
            // сохраняем состояние ветви
            treeState.setClosed(branch);
        }
    });
    // скрывать только нужные ветви
    $('.ul-dropfree ul').each(function (ix, branch) {
        if (treeState.isClosed(branch)) {
            $(branch).slideUp(400)
                .prevAll('div.drop')
                .css({ 'background-position': '0 0' });
        }
    });
});