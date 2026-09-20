from crud.audit_log import create_audit_log
from models.system_setting import SystemSetting
from schemas.system_setting import SystemSettingUpdate
from sqlalchemy.orm import Session


def get_system_settings(db: Session) -> SystemSetting | None:
    return db.query(SystemSetting).first()


def create_default_system_settings(db: Session) -> SystemSetting:
    settings = SystemSetting(
        platform_name="Kisaan Mitra",
        support_email="support@kisaanmitra.gov.in",
        support_phone="1800-XXX-XXXX",
        max_bookings_per_farmer_per_day=3,
        booking_window_days=7,
        slot_duration_minutes=120,
        enable_farmer_registration=True,
        enable_mandi_owner_registration=True,
        require_aadhaar_verification=False,
        enable_sms_notifications=True,
        maintenance_mode=False,
    )

    db.add(settings)
    db.commit()
    db.refresh(settings)

    return settings


def get_or_create_system_settings(db: Session) -> SystemSetting:
    settings = get_system_settings(db)

    if settings is not None:
        return settings

    return create_default_system_settings(db)


def update_system_settings(
    db: Session,
    settings_data: SystemSettingUpdate,
    *,
    actor_id: int | None,
    actor_name: str | None,
    actor_role: str | None,
) -> SystemSetting:
    settings = get_or_create_system_settings(db)

    update_data = settings_data.model_dump(exclude_unset=True)

    changed_fields = {}

    for field, value in update_data.items():
        old_value = getattr(settings, field)

        if old_value != value:
            changed_fields[field] = {
                "old": old_value,
                "new": value,
            }
            setattr(settings, field, value)

    if changed_fields:
        create_audit_log(
            db,
            actor_id=actor_id,
            actor_name=actor_name,
            actor_role=actor_role,
            action="UPDATE_SYSTEM_SETTINGS",
            entity_type="system_settings",
            entity_id=str(settings.id),
            description="Super Admin updated platform system settings.",
            details={
                "changed_fields": changed_fields,
            },
        )

    db.commit()
    db.refresh(settings)

    return settings