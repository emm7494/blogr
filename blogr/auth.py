from werkzeug.security import check_password_hash, generate_password_hash
import functools
from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for
)

from blogr.db import get_db

bp = Blueprint('auth', __name__, url_prefix='/auth')


@bp.route('/register', methods=('GET', 'POST'))
def register():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        db = get_db()
        error = None

        if not username:
            error = 'Username is required'
        elif not password:
            error = 'Password is required'
        elif db.execute('SELECT id FROM user WHERE username = ?', (username,)).fetchone() is not None:
            error = f'User {username} is already registered'

        if error is None:
            return redirect(url_for('auth.login'))
    return render_template('auth/login.html')
