from getpass import getpass

from auth.password import hash_password
from database.connection import engine
from models.user import User
from sqlalchemy.orm import Session


def main():
    print("=== Kisaan Mitra Super Admin Setup ===")

    name = input("Government officer name: ").strip()
    phone = input("Phone number: ").strip()
    email = input("Email address: ").strip()

    password = getpass("Password: ")
    confirm_password = getpass("Confirm password: ")

    if not name:
        print("Error: Name is required.")
        return

    if len(phone) < 10:
        print("Error: Phone number must contain at least 10 characters.")
        return

    if not password:
        print("Error: Password is required.")
        return

    if len(password) < 8:
        print("Error: Password must be at least 8 characters.")
        return

    if password != confirm_password:
        print("Error: Passwords do not match.")
        return

    db = Session(engine)

    try:
        existing_phone = db.query(User).filter(User.phone == phone).first()

        if existing_phone:
            print("Error: A user with this phone number already exists.")
            return

        if email:
            existing_email = db.query(User).filter(User.email == email).first()

            if existing_email:
                print("Error: A user with this email already exists.")
                return

        super_admin = User(
            name=name,
            phone=phone,
            email=email or None,
            password_hash=hash_password(password),
            role="superAdmin",
            is_active=True,
        )

        db.add(super_admin)
        db.commit()
        db.refresh(super_admin)

        print()
        print("Super Admin created successfully.")
        print(f"User ID: {super_admin.id}")
        print(f"Role: {super_admin.role}")

    except Exception as exc:
        db.rollback()
        print(f"Error creating Super Admin: {exc}")

    finally:
        db.close()


if __name__ == "__main__":
    main()