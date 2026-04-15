local p = {}

function p.base(f)
    local args = f
    if f == mw.getCurrentFrame() then
        args = require('Module:ProcessArgs').merge(false)
    else
        f = mw.getCurrentFrame()
    end
    return p.createTag(args[1], args)
end

function p.createTag(name, args)
    local div = mw.html.create('div')
    div
        :attr('class', 'mjw-tool')
        :attr('data-name', name)
        :wikitext('ツールを読み込んでいます。機能しない場合はJavaScriptが有効化されていることを確認して、ページを再読み込みしてください。')

    for k, v in pairs(args) do
        if k ~= 1 then
            div:attr('data-' .. k, v)
        end
    end

    return tostring(div)
end

return p
