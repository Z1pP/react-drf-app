from django import forms

class FormSendMessage(forms.Form):
    message = forms.CharField(widget=forms.Textarea)
    send_time = forms.DateTimeField(
        label='Время отправки',
        widget=forms.DateTimeInput(attrs={'type': 'datetime-local'}),
        required=False
    )
    postpone = forms.BooleanField(
        label='Отложить отправку',
        required=False,
        widget=forms.CheckboxInput
    )