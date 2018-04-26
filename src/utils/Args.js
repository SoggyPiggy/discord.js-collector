module.exports =
{
	cardID:
	{
		key: 'cardID',
		label: 'Card ID',
		prompt: 'What is the ID of the Card?',
		type: 'string',
	},
	setID:
	{
		key: 'setID',
		label: 'Set ID',
		prompt: 'What is the ID of the Set?',
		type: 'string',
	},
	page:
	{
		key: 'page',
		label: 'Page Number',
		prompt: 'Which page would you like to view?',
		type: 'integer',
		default: 1
	},
	search:
	{
		key: 'filters',
		label: 'Filter(s)',
		prompt: 'What filters would you like to apply?',
		type: 'string',
		default: false
	},
	user:
	{
		key: 'member',
		label: 'User',
		prompt: 'Who?',
		type: 'user',
		default: false
	},
	pageSearch:
	{
		key: 'page',
		label: 'Page Number / Filter',
		prompt: 'Which page would you like to view? or what filters would you like to apply?',
		type: 'integer|string',
		default: 1
	},
	pageUser:
	{
		key: 'page',
		label: 'Page Number / User',
		prompt: 'Which page would you like to view? or who?',
		type: 'integer|user',
		default: 1
	},
	credits:
	{
		key: 'credits',
		label: 'Credits',
		prompt: 'How many credits?',
		type: 'integer'
	},
	userRequired:
	{
		key: 'member',
		label: 'User',
		prompt: 'Who?',
		type: 'user'
	},
	creditConfirmation: credits =>
	{
		let data =
		{
			key: 'confirmation',
			labal: 'Spending Confirmation',
			prompt: `Confirm you'd like to spend ${credits}\n(Y)es or (N)o`,
			type: 'boolean'
		}
		return data
	}
}