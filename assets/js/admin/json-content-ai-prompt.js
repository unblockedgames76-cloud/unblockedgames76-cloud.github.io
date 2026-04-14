(function ($) {
    'use strict';

    $(function () {
        const AI_MODEL_COST_VI = {
            low: 'chi phí thấp',
            medium: 'chi phí trung bình',
            high: 'chi phí cao',
            very_high: 'chi phí rất cao'
        };

        const AI_MODEL_COST_ORDER = { low: 0, medium: 1, high: 2, very_high: 3 };

        const AI_MODEL_COST_COLORS = {
            low: '#15803d',
            medium: '#a16207',
            high: '#dc2626',
            very_high: '#991b1b'
        };

        const AI_MODELS = {
            openai: [
                { id: 'gpt-3.5-turbo', cost: 'low' },
                { id: 'gpt-4.1-nano', cost: 'low' },
                { id: 'gpt-4o-mini', cost: 'low' },
                { id: 'gpt-4.1-mini', cost: 'low' },
                { id: 'gpt-4.1', cost: 'medium' },
                { id: 'gpt-4o', cost: 'medium' },
                { id: 'gpt-4', cost: 'high' },
                { id: 'o3-mini', cost: 'high' },
                { id: 'o1-mini', cost: 'very_high' },
                { id: 'o1', cost: 'very_high' }
            ],
       
            google: [
                { id: 'gemini-2.0-flash-lite', cost: 'low' },
                { id: 'gemini-1.5-flash', cost: 'low' },
                { id: 'gemini-2.0-flash', cost: 'medium' },
                { id: 'gemini-1.5-pro', cost: 'high' }
            ],
            // anthropic: [
            //     { id: 'claude-3-haiku', cost: 'low' },
            //     { id: 'claude-3-5-haiku', cost: 'low' },
            //     { id: 'claude-3-sonnet', cost: 'medium' },
            //     { id: 'claude-3-5-sonnet', cost: 'medium' },
            //     { id: 'claude-3-7-sonnet', cost: 'high' },
            //     { id: 'claude-3-opus', cost: 'very_high' }
            // ],
            // grok: [
            //     { id: 'grok-2-mini', cost: 'low' },
            //     { id: 'grok-2', cost: 'high' }
            // ],
            // local: [
            //     { id: 'llama3.1:8b', cost: 'low' },
            //     { id: 'mistral:7b', cost: 'low' },
            //     { id: 'qwen2.5:7b', cost: 'low' },
            //     { id: 'qwen2.5:14b', cost: 'medium' },
            //     { id: 'mixtral:8x7b', cost: 'medium' },
            //     { id: 'llama3.1:70b', cost: 'high' }
            // ]
        };

        function aiModelEntryId(entry) {
            return typeof entry === 'string' ? entry : entry.id;
        }

        function aiModelEntryCostKey(entry) {
            if (typeof entry === 'string') {
                return null;
            }
            return entry.cost || null;
        }

        function aiModelEntryLabel(entry) {
            if (typeof entry === 'string') {
                return entry;
            }
            const vi = AI_MODEL_COST_VI[entry.cost] || '';
            return vi ? (entry.id + ' — ' + vi) : entry.id;
        }

        function aiModelEntryOptionColor(entry) {
            const key = aiModelEntryCostKey(entry);
            return key && AI_MODEL_COST_COLORS[key] ? AI_MODEL_COST_COLORS[key] : '#334155';
        }

        function aiSortModelsByCost(models) {
            return models.slice().map(function (e, i) {
                return { e: e, i: i };
            }).sort(function (a, b) {
                const ra = typeof a.e === 'string' ? 99 : (AI_MODEL_COST_ORDER[a.e.cost] ?? 99);
                const rb = typeof b.e === 'string' ? 99 : (AI_MODEL_COST_ORDER[b.e.cost] ?? 99);
                if (ra !== rb) {
                    return ra - rb;
                }
                return a.i - b.i;
            }).map(function (x) {
                return x.e;
            });
        }

        function aiModelsForProviderSorted(provider) {
            return aiSortModelsByCost(AI_MODELS[provider] || []);
        }

        function updateAiModelDropdown($form, opts) {
            opts = opts || {};
            const fromProviderChange = !!opts.fromProviderChange;

            const provider = String($form.find('select.js-ai-provider-select[name="ai_provider"], select[name="ai_provider"]').first().val() || 'openai').toLowerCase();
            const $select = $form.find('select.js-ai-model-select[name="model"]').first();
            if (!$select.length) {
                return;
            }

            const sortedModels = aiModelsForProviderSorted(provider);
            const modelIds = sortedModels.map(aiModelEntryId);
            const savedFromDb = String($select.attr('data-saved-model') || '').trim();

            let preferValue = '';
            if (!fromProviderChange && savedFromDb !== '') {
                preferValue = savedFromDb;
            }

            $select.find('option').not(':first').remove();

            sortedModels.forEach(function (entry) {
                const id = aiModelEntryId(entry);
                const $opt = $('<option/>').attr('value', id).text(aiModelEntryLabel(entry));
                $opt.css('color', aiModelEntryOptionColor(entry));
                $select.append($opt);
            });

            if (!fromProviderChange && preferValue !== '' && modelIds.indexOf(preferValue) === -1) {
                $select.append(
                    $('<option/>').attr('value', preferValue).text(preferValue + ' (đã lưu)').css('color', '#64748b')
                );
            }

            if (preferValue !== '') {
                $select.val(preferValue);
                if ($select.val() !== preferValue && modelIds.length > 0) {
                    $select.val(modelIds[0]);
                }
            } else if (modelIds.length > 0) {
                $select.val(modelIds[0]);
            } else {
                $select.val('');
            }

            $select.removeAttr('data-saved-model');
        }

        $('.ai-prompt-form').each(function () {
            updateAiModelDropdown($(this), { fromProviderChange: false });
        });

        $(document).on('change', '.ai-prompt-form select.js-ai-provider-select[name="ai_provider"], .ai-prompt-form select[name="ai_provider"]', function () {
            updateAiModelDropdown($(this).closest('.ai-prompt-form'), { fromProviderChange: true });
        });
    });
})(window.jQuery);
