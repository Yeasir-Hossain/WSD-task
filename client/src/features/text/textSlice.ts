import { IText } from '@/types';
import { apiSlice } from "@/features/api/apiSlice";

export const textAnalysisApi = apiSlice.injectEndpoints({
	overrideExisting: true,
	endpoints: (builder) => ({
		getAllTexts: builder.query<IText[], any>({
			query: (queries) => {
				const values = Object.values(queries);
				if (values.length) return `/text?${new URLSearchParams(queries)}`;
				return '/text';
			},
			providesTags: (result) =>
				result
					? [
						...result.map(({ id }) => ({ type: 'text' as const, id })),
						{ type: 'text' as const, id: 'LIST' },
					]
					: [{ type: 'text' as const, id: 'LIST' }],
		}),

		getSingleText: builder.query<IText, string>({
			query: (id) => `/text/${id}`,
			providesTags: (_result, _error, id) => [{ type: 'text', id }],
		}),

		getWordCount: builder.query({
			query: (id) => `/text/${id}/words`,
			providesTags: (_result, _error, id) => [{ type: 'textstats', id, subtype: 'words' }],
		}),

		getCharacterCount: builder.query({
			query: (id) => `/text/${id}/characters`,
			providesTags: (_result, _error, id) => [{ type: 'textstats', id, subtype: 'characters' }],
		}),

		getSentenceCount: builder.query({
			query: (id) => `/text/${id}/sentences`,
			providesTags: (_result, _error, id) => [{ type: 'textstats', id, subtype: 'sentences' }],
		}),

		getParagraphCount: builder.query({
			query: (id) => `/text/${id}/paragraphs`,
			providesTags: (_result, _error, id) => [{ type: 'textstats', id, subtype: 'paragraphs' }],
		}),

		getLongestWords: builder.query({
			query: (id) => `/text/${id}/longest-words`,
			providesTags: (_result, _error, id) => [{ type: 'textstats', id, subtype: 'longest-words' }],
		}),

		createText: builder.mutation({
			query: (text: string) => ({
				url: `/text`,
				method: 'POST',
				body: { text },
			}),
			invalidatesTags: [{ type: 'text', id: 'LIST' }],
		}),

		updateText: builder.mutation({
			query: ({ id, text }: { id: string; text: string }) => ({
				url: `/text/${id}`,
				method: 'PATCH',
				body: { text },
			}),
			invalidatesTags: (_result, _error, { id }) => [
				{ type: 'text', id },
				{ type: 'textstats', id },
			]
		}),

		deleteText: builder.mutation({
			query: (id: string) => ({
				url: `/text/${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: (_result, _error, id) => [
				{ type: 'text', id },
				{ type: 'text', id: 'LIST' },
				{ type: 'textstats', id },
			]
		}),
	}),
});

export const {
	useGetAllTextsQuery,
	useGetSingleTextQuery,
	useGetWordCountQuery,
	useGetCharacterCountQuery,
	useGetSentenceCountQuery,
	useGetParagraphCountQuery,
	useGetLongestWordsQuery,
	useCreateTextMutation,
	useUpdateTextMutation,
	useDeleteTextMutation,
} = textAnalysisApi;